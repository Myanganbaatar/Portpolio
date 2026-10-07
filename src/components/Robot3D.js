import { Component, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/*
 * A small hovering robot built from primitives (no external model to download).
 * `mode` picks what it does on each page; its head always follows the pointer.
 */

const PALETTE = {
  dark: { shell: '#e6eaf2', joint: '#2b303c', visor: '#0b0d12', eye: '#7cf0c5', accent: '#7cf0c5', accent2: '#8ea2ff', warm: '#f5c46b', screen: '#0e1117' },
  light: { shell: '#ffffff', joint: '#3a4050', visor: '#151821', eye: '#22e3a6', accent: '#0f9d74', accent2: '#4b5fd6', warm: '#d98b1e', screen: '#11141b' },
};

// Pointer and scroll are tracked on the whole window, not only over the canvas.
const input = { x: 0, y: 0, scrollVel: 0 };
let listeners = 0;
function useWindowInput() {
  useEffect(() => {
    if (listeners++ > 0) return () => listeners--;
    let lastY = window.scrollY;
    const onMove = (e) => {
      input.x = (e.clientX / window.innerWidth) * 2 - 1;
      input.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onScroll = () => {
      input.scrollVel = window.scrollY - lastY;
      lastY = window.scrollY;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      listeners--;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
}

const damp = THREE.MathUtils.damp;

// Canvas texture with colourful "code" lines that scrolls on a screen.
function useCodeTexture(colors) {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 512;
    const g = c.getContext('2d');
    g.fillStyle = colors.screen;
    g.fillRect(0, 0, 256, 512);
    const tones = [colors.accent, colors.accent2, colors.warm, '#c8cede', '#ff7a90'];
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let row = 0; row < 32; row++) {
      let x = 14 + Math.floor(rand() * 4) * 14;
      const y = 10 + row * 16;
      const parts = 1 + Math.floor(rand() * 3);
      for (let k = 0; k < parts && x < 230; k++) {
        const w = 18 + rand() * 60;
        g.fillStyle = tones[Math.floor(rand() * tones.length)];
        g.globalAlpha = 0.85;
        g.fillRect(x, y, Math.min(w, 240 - x), 7);
        x += w + 8;
      }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 0.5);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [colors]);
}

function Screen({ colors, width = 1.5, height = 0.92, speed = 0.06 }) {
  const tex = useCodeTexture(colors);
  useFrame((_, dt) => {
    tex.offset.y -= dt * speed;
  });
  return (
    <group>
      <RoundedBox args={[width + 0.12, height + 0.12, 0.08]} radius={0.04} smoothness={4}>
        <meshStandardMaterial color={colors.joint} roughness={0.4} metalness={0.4} />
      </RoundedBox>
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Monitor({ colors, ...props }) {
  return (
    <group {...props}>
      <group position={[0, 1.55, 0]}>
        <Screen colors={colors} />
      </group>
      <mesh position={[0, 0.95, -0.05]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 12]} />
        <meshStandardMaterial color={colors.joint} />
      </mesh>
      <mesh position={[0, 0.7, -0.05]}>
        <cylinderGeometry args={[0.32, 0.36, 0.05, 24]} />
        <meshStandardMaterial color={colors.joint} />
      </mesh>
    </group>
  );
}

function Robot({ mode, colors, robotRef, rightHandSlot, bothHandsSlot }) {
  const head = useRef();
  const eyes = useRef();
  const antenna = useRef();
  const lS = useRef();
  const rS = useRef();
  const lE = useRef();
  const rE = useRef();
  const body = useRef();
  const flame = useRef();
  const eyeMat = useRef();

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const px = input.x;
    const py = input.y;

    // hover + lean on scroll
    if (body.current) {
      const bob = mode === 'play' ? Math.sin(t * 5) * 0.05 : Math.sin(t * 2) * 0.07;
      body.current.position.y = 0.05 + bob;
      body.current.rotation.x = damp(body.current.rotation.x, THREE.MathUtils.clamp(input.scrollVel * 0.01, -0.25, 0.25), 4, dt);
      body.current.rotation.z = mode === 'play' ? Math.sin(t * 3) * 0.07 : damp(body.current.rotation.z, -px * 0.06, 3, dt);
      input.scrollVel *= 0.9;
    }
    if (flame.current) flame.current.scale.setScalar(0.85 + Math.sin(t * 20) * 0.08);

    // head follows the pointer, with per-mode offsets
    let yaw = px * 0.6;
    let pitch = -py * 0.3;
    let roll = 0;
    if (mode === 'type') {
      yaw = 0.15 + px * 0.25;
      pitch = 0.25 - py * 0.1;
    } else if (mode === 'juggle') {
      pitch = -0.35 - py * 0.1;
      yaw = Math.sin(t * 2.2) * 0.25 + px * 0.2;
    } else if (mode === 'lost') {
      yaw = Math.sin(t * 3) * 0.45;
      roll = 0.18;
    } else if (mode === 'globe') {
      yaw = -0.45 + px * 0.3;
    } else if (mode === 'play') {
      pitch = 0.3 - py * 0.1;
    }
    if (head.current) {
      head.current.rotation.y = damp(head.current.rotation.y, yaw, 5, dt);
      head.current.rotation.x = damp(head.current.rotation.x, pitch, 5, dt);
      head.current.rotation.z = damp(head.current.rotation.z, roll, 4, dt);
    }

    // blink
    if (eyes.current) eyes.current.scale.y = t % 3.6 < 0.12 ? 0.15 : 1;
    if (antenna.current) antenna.current.material.emissiveIntensity = 1.2 + Math.sin(t * 4) * 0.8;
    if (eyeMat.current) eyeMat.current.emissive.set(mode === 'lost' ? '#ff8a5c' : colors.eye);

    // arms: [shoulderX, shoulderZ, elbowX] targets for left and right
    let L = [Math.sin(t * 1.5) * 0.08, -0.12, -0.15];
    let R = [-Math.sin(t * 1.5) * 0.08, 0.12, -0.15];
    switch (mode) {
      case 'hello':
        R = [0, 2.6 + Math.sin(t * 7) * 0.12, 0];
        if (rE.current) rE.current.rotation.z = 0.5 + Math.sin(t * 7) * 0.45;
        break;
      case 'type':
        L = [-1.25, 0.25, -0.35 + Math.sin(t * 15) * 0.18];
        R = [-1.25, -0.25, -0.35 + Math.sin(t * 15 + 1.6) * 0.18];
        break;
      case 'present':
        R = [-0.3, 1.45, -0.1];
        break;
      case 'juggle':
        L = [-0.95, 0.15 + Math.sin(t * 4) * 0.15, -0.6 + Math.sin(t * 4) * 0.3];
        R = [-0.95, -0.15 - Math.sin(t * 4) * 0.15, -0.6 - Math.sin(t * 4) * 0.3];
        break;
      case 'mail': {
        R = [-1.15, 0.2, -0.45];
        const waving = t % 6 < 2.2;
        L = waving ? [0, -2.5 - Math.sin(t * 7) * 0.15, 0] : L;
        break;
      }
      case 'play':
        L = [-1.05, 0.38, -0.55 + Math.sin(t * 12) * 0.08];
        R = [-1.05, -0.38, -0.55 + Math.cos(t * 13) * 0.08];
        break;
      case 'globe':
        L = [-0.2, -1.4, -0.1];
        break;
      case 'lost':
        L = [0, -0.7, -1.6];
        R = [0, 0.7, -1.6];
        break;
      default:
    }
    if (lS.current) {
      lS.current.rotation.x = damp(lS.current.rotation.x, L[0], 6, dt);
      lS.current.rotation.z = damp(lS.current.rotation.z, L[1], 6, dt);
      lE.current.rotation.x = damp(lE.current.rotation.x, L[2], 8, dt);
    }
    if (rS.current) {
      rS.current.rotation.x = damp(rS.current.rotation.x, R[0], 6, dt);
      rS.current.rotation.z = damp(rS.current.rotation.z, R[1], 6, dt);
      rE.current.rotation.x = damp(rE.current.rotation.x, R[2], 8, dt);
      if (mode !== 'hello') rE.current.rotation.z = damp(rE.current.rotation.z, 0, 6, dt);
    }
  });

  const shell = <meshStandardMaterial color={colors.shell} roughness={0.32} metalness={0.15} />;
  const joint = <meshStandardMaterial color={colors.joint} roughness={0.5} metalness={0.5} />;

  const arm = (side, sRef, eRef, slot) => (
    <group ref={sRef} position={[side * 0.66, 1.52, 0]}>
      <mesh>
        <sphereGeometry args={[0.13, 20, 20]} />
        {joint}
      </mesh>
      <mesh position={[0, -0.24, 0]}>
        <capsuleGeometry args={[0.085, 0.3, 6, 12]} />
        {shell}
      </mesh>
      <group ref={eRef} position={[0, -0.5, 0]}>
        <mesh>
          <sphereGeometry args={[0.09, 16, 16]} />
          {joint}
        </mesh>
        <mesh position={[0, -0.22, 0]}>
          <capsuleGeometry args={[0.08, 0.26, 6, 12]} />
          {shell}
        </mesh>
        <group position={[0, -0.48, 0]}>
          <mesh>
            <sphereGeometry args={[0.12, 20, 20]} />
            <meshStandardMaterial color={colors.accent} roughness={0.3} metalness={0.3} />
          </mesh>
          {slot}
        </group>
      </group>
    </group>
  );

  return (
    <group ref={robotRef}>
      <group ref={body}>
        {/* hover base */}
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.36, 0.2, 0.36, 28]} />
          {shell}
        </mesh>
        <mesh ref={flame} position={[0, 0.34, 0]}>
          <coneGeometry args={[0.16, 0.38, 20]} />
          <meshBasicMaterial color={colors.accent2} transparent opacity={0.65} toneMapped={false} />
        </mesh>
        {/* torso */}
        <RoundedBox args={[1.05, 0.95, 0.72]} radius={0.22} smoothness={5} position={[0, 1.25, 0]}>
          {shell}
        </RoundedBox>
        <mesh position={[0, 1.3, 0.365]}>
          <circleGeometry args={[0.13, 32]} />
          <meshStandardMaterial color={colors.accent} emissive={colors.accent} emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
        <mesh position={[0, 1.08, 0.37]}>
          <planeGeometry args={[0.46, 0.05]} />
          <meshBasicMaterial color={colors.joint} />
        </mesh>
        {/* neck + head */}
        <mesh position={[0, 1.78, 0]}>
          <cylinderGeometry args={[0.12, 0.14, 0.16, 16]} />
          {joint}
        </mesh>
        <group ref={head} position={[0, 1.86, 0]}>
          <RoundedBox args={[0.98, 0.74, 0.78]} radius={0.24} smoothness={5} position={[0, 0.36, 0]}>
            {shell}
          </RoundedBox>
          <RoundedBox args={[0.8, 0.46, 0.06]} radius={0.12} smoothness={4} position={[0, 0.36, 0.38]}>
            <meshStandardMaterial color={colors.visor} roughness={0.15} metalness={0.6} />
          </RoundedBox>
          <group ref={eyes} position={[0, 0.38, 0.42]}>
            {[-0.18, 0.18].map((x) => (
              <mesh key={x} position={[x, 0, 0]}>
                <capsuleGeometry args={[0.055, 0.08, 4, 12]} />
                <meshStandardMaterial ref={x < 0 ? eyeMat : undefined} color={colors.eye} emissive={colors.eye} emissiveIntensity={2} toneMapped={false} />
              </mesh>
            ))}
          </group>
          {/* ears */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.5, 0.36, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.12, 0.12, 0.08, 20]} />
              {joint}
            </mesh>
          ))}
          <mesh position={[0, 0.82, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.22, 8]} />
            {joint}
          </mesh>
          <mesh ref={antenna} position={[0, 0.96, 0]}>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshStandardMaterial color={colors.warm} emissive={colors.warm} emissiveIntensity={1.5} toneMapped={false} />
          </mesh>
        </group>
        {arm(-1, lS, lE, null)}
        {arm(1, rS, rE, rightHandSlot)}
        {bothHandsSlot}
      </group>
    </group>
  );
}

/* ---------- page props ---------- */

function Envelope({ colors }) {
  const ref = useRef();
  useFrame((s) => {
    if (ref.current) ref.current.rotation.z = Math.sin(s.clock.elapsedTime * 3) * 0.12;
  });
  return (
    <group ref={ref} position={[0, -0.05, 0.22]} rotation={[1.2, 0, 0]}>
      <mesh>
        <boxGeometry args={[0.62, 0.4, 0.03]} />
        <meshStandardMaterial color="#fbfbf7" roughness={0.6} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.15, 0.08, 0.017]} rotation={[0, 0, s * 0.55]}>
          <planeGeometry args={[0.36, 0.02]} />
          <meshBasicMaterial color="#c9ccd6" />
        </mesh>
      ))}
      <mesh position={[0, -0.02, 0.02]}>
        <circleGeometry args={[0.05, 20]} />
        <meshStandardMaterial color="#ff6b81" emissive="#ff6b81" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

function Controller({ colors }) {
  return (
    <group position={[0, 0.98, 0.78]} rotation={[0.5, 0, 0]}>
      <RoundedBox args={[0.7, 0.24, 0.3]} radius={0.1} smoothness={4}>
        <meshStandardMaterial color={colors.joint} roughness={0.4} />
      </RoundedBox>
      {[
        [0.18, 0.04, colors.accent],
        [0.26, -0.02, colors.warm],
        [0.1, -0.02, '#ff6b81'],
        [0.18, -0.08, colors.accent2],
      ].map(([x, y, c], i) => (
        <mesh key={i} position={[x, y + 0.04, 0.155]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.8} />
        </mesh>
      ))}
      <mesh position={[-0.18, 0.02, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
        <meshStandardMaterial color="#555b6b" />
      </mesh>
    </group>
  );
}

function Desk({ colors }) {
  return (
    <group position={[-0.55, 0, 1.0]} rotation={[0, 0.45, 0]}>
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[2.2, 0.08, 1.0]} />
        <meshStandardMaterial color={colors.joint} roughness={0.6} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.98, 0.42, 0]}>
          <boxGeometry args={[0.07, 0.84, 0.8]} />
          <meshStandardMaterial color={colors.joint} />
        </mesh>
      ))}
      <Monitor colors={colors} position={[-0.2, 0.06, -0.15]} scale={0.8} />
      <mesh position={[0.25, 0.9, 0.22]} rotation={[-0.05, 0, 0]}>
        <boxGeometry args={[0.7, 0.03, 0.22]} />
        <meshStandardMaterial color="#3b4152" />
      </mesh>
    </group>
  );
}

function OrbitScreens({ colors }) {
  const group = useRef();
  const { camera } = useThree();
  useFrame((s, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.35;
    group.current.children.forEach((child) => child.lookAt(camera.position));
  });
  return (
    <group ref={group} position={[0, 1.55, 0]}>
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2;
        return (
          <group key={i} position={[Math.cos(a) * 1.9, Math.sin(a * 2) * 0.35, Math.sin(a) * 1.9]} scale={0.42}>
            <Screen colors={colors} speed={0.04 + i * 0.03} />
          </group>
        );
      })}
    </group>
  );
}

function JuggleOrbs({ colors }) {
  const refs = useRef([]);
  const tones = ['#f7df1e', '#61dafb', '#68a063', colors.accent2];
  useFrame((s) => {
    const t = s.clock.elapsedTime * 2.4;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const ph = t + (i * Math.PI * 2) / tones.length;
      m.position.set(Math.cos(ph) * 0.75, 1.15 + Math.abs(Math.sin(ph)) * 1.65, 0.75);
      m.rotation.y = ph;
    });
  });
  return tones.map((c, i) => (
    <mesh key={c} ref={(m) => (refs.current[i] = m)}>
      <icosahedronGeometry args={[0.15, 1]} />
      <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.55} flatShading />
    </mesh>
  ));
}

function latLon(lat, lon, r) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

function Globe({ colors }) {
  const ref = useRef();
  const r = 0.75;
  const { ulaanbaatar, limoges, arc } = useMemo(() => {
    const a = latLon(47.9, 106.9, r);
    const b = latLon(45.8, 1.26, r);
    const mid = a.clone().add(b).normalize().multiplyScalar(r * 1.55);
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    return { ulaanbaatar: a, limoges: b, arc: new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)) };
  }, []);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.3;
  });
  return (
    <group position={[-1.55, 1.7, 0.2]}>
      <group ref={ref} rotation={[0.35, 0, 0]}>
        <mesh>
          <sphereGeometry args={[r * 0.98, 32, 32]} />
          <meshStandardMaterial color={colors.accent2} transparent opacity={0.12} />
        </mesh>
        <mesh>
          <sphereGeometry args={[r, 18, 12]} />
          <meshBasicMaterial color={colors.accent2} wireframe transparent opacity={0.4} />
        </mesh>
        {[ulaanbaatar, limoges].map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshBasicMaterial color={i ? colors.accent : colors.warm} toneMapped={false} />
          </mesh>
        ))}
        <line geometry={arc}>
          <lineBasicMaterial color={colors.accent} />
        </line>
      </group>
    </group>
  );
}

function QuestionMark({ colors }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.position.y = 3.35 + Math.sin(t * 2.5) * 0.08;
    ref.current.rotation.y = Math.sin(t * 1.5) * 0.6;
  });
  return (
    <group ref={ref} position={[0.55, 3.35, 0]}>
      <mesh position={[0, 0.12, 0]} rotation={[0, 0, -0.6]}>
        <torusGeometry args={[0.16, 0.05, 12, 32, Math.PI * 1.4]} />
        <meshStandardMaterial color={colors.warm} emissive={colors.warm} emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.14, 12]} />
        <meshStandardMaterial color={colors.warm} emissive={colors.warm} emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial color={colors.warm} emissive={colors.warm} emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

function Shadow({ x = 0 }) {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(0,0,0,0.45)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.001, 0]}>
      <planeGeometry args={[1.6, 1.6]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}

const LAYOUT = {
  hello: { robot: [0.55, 0, 0], rot: -0.15, cam: [0, 1.9, 6.6] },
  type: { robot: [0.75, 0, 0], rot: -0.75, cam: [0.2, 2.2, 6.4] },
  present: { robot: [0, 0, 0], rot: 0, cam: [0, 2, 6.8] },
  juggle: { robot: [0, 0, 0], rot: 0, cam: [0, 2.1, 6.4] },
  mail: { robot: [0, 0, 0], rot: 0.15, cam: [0, 1.9, 5.8] },
  play: { robot: [0, 0, 0], rot: 0, cam: [0, 1.9, 5.6] },
  globe: { robot: [0.65, 0, 0], rot: -0.25, cam: [-0.3, 1.9, 6.4] },
  lost: { robot: [0, 0, 0], rot: 0, cam: [0, 2.1, 6] },
};

function Scene({ mode, theme }) {
  useWindowInput();
  const colors = PALETTE[theme] || PALETTE.dark;
  const L = LAYOUT[mode] || LAYOUT.hello;
  const robot = useRef();
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...L.cam);
    camera.lookAt(L.cam[0] * 0.5, 1.55, 0);
  }, [camera, L]);

  useFrame((_, dt) => {
    if (!robot.current) return;
    robot.current.rotation.y = damp(robot.current.rotation.y, L.rot + input.x * 0.25, 2.5, dt);
  });

  return (
    <>
      <ambientLight intensity={theme === 'light' ? 0.85 : 0.55} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} />
      <pointLight position={[-3, 2, 2]} intensity={14} color={colors.accent2} />
      <pointLight position={[2, 1, 3]} intensity={8} color={colors.accent} />

      <group position={L.robot}>
        <Robot
          mode={mode}
          colors={colors}
          robotRef={robot}
          rightHandSlot={mode === 'mail' ? <Envelope colors={colors} /> : null}
          bothHandsSlot={mode === 'play' ? <Controller colors={colors} /> : null}
        />
        <Shadow />
        {mode === 'juggle' && <JuggleOrbs colors={colors} />}
        {mode === 'lost' && <QuestionMark colors={colors} />}
      </group>

      {mode === 'hello' && <Monitor colors={colors} position={[-1.35, 0, -0.6]} rotation={[0, 0.35, 0]} />}
      {mode === 'type' && <Desk colors={colors} />}
      {mode === 'present' && <OrbitScreens colors={colors} />}
      {mode === 'globe' && <Globe colors={colors} />}
      <Sparkles count={40} scale={[7, 4, 4]} position={[0, 2, 0]} size={2} speed={0.3} color={colors.accent2} opacity={0.5} />
    </>
  );
}

class WebGLBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function RobotStage({ mode = 'hello', theme = 'dark', active = true }) {
  const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <WebGLBoundary>
      <Canvas
        className="robot-canvas"
        camera={{ position: [0, 2, 6.5], fov: 38 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={active && !still ? 'always' : 'demand'}
        aria-hidden="true"
      >
        <Scene mode={mode} theme={theme} />
      </Canvas>
    </WebGLBoundary>
  );
}
