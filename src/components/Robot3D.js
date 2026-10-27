import { Component, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useStill } from '../context';
import { Atmosphere, usePlanetTexture, useRingGeometry, useRingTexture } from './spaceMaterials';
import { LAYOUT, PAGE_PLANET, PLANET_R } from './robotLayout';

/*
 * A small hovering robot built from primitives (no external model to download).
 * `mode` picks what it does on each page; its head always follows the pointer.
 */

export const PALETTE = {
  dark: { shell: '#e6eaf2', joint: '#2b303c', visor: '#0b0d12', eye: '#22d3ee', accent: '#a78bfa', accent2: '#22d3ee', warm: '#f5c46b', screen: '#0e1117' },
  light: { shell: '#ffffff', joint: '#3a4050', visor: '#151821', eye: '#06b6d4', accent: '#7c3aed', accent2: '#0891b2', warm: '#d98b1e', screen: '#11141b' },
};

// Pointer and scroll are tracked on the whole window, not only over the canvas.
export const input = { x: 0, y: 0, scrollVel: 0 };
let listeners = 0;
export function useWindowInput() {
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

// Skills page: the robot stacks technology blocks into a tower, which then falls and
// starts again. BuildTower drives the timeline; the robot's arms read `build`.
const BUILD_BLOCKS = [
  ['React', '#61dafb', '#0b2530'],
  ['Next.js', '#111111', '#ffffff'],
  ['Node.js', '#68a063', '#ffffff'],
  ['Symfony', '#1a171b', '#ffffff'],
  ['NoSQL', '#47a248', '#ffffff'],
  ['Docker', '#2496ed', '#ffffff'],
];
const BUILD_STEP = 1.7; // seconds per block
const BUILD_HOLD = 1.6; // finished tower stays up
const BUILD_FALL = 1.6; // collapse
const BUILD_CYCLE = BUILD_BLOCKS.length * BUILD_STEP + BUILD_HOLD + BUILD_FALL;
const build = { carrying: false, u: 0 };

// Contact page: the robot throws a paper plane every PLANE_CYCLE seconds.
const PLANE_CYCLE = 4.6;
const PLANE_RELEASE = 0.56; // share of the cycle when the plane leaves the hand

// Projects page: the robot clicks a remote and the screen shows the next project.
const SLIDE_TIME = 3.2;
const SLIDES = ['cms', 'aupair', 'correcturl', 'latice', 'python', 'questionary', 'netflix', 'kotlin', 'maui'];

export function Robot({ mode, colors, robotRef, rightHandSlot, leftHandSlot = null, bothHandsSlot }) {
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
      const bob = mode === 'play' ? Math.sin(t * 5) * 0.05 : mode === 'type' ? Math.sin(t * 2) * 0.012 : Math.sin(t * 2) * 0.07;
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
      // looks at the monitor on its right, glancing down at the keys now and then
      const glance = t % 5 < 0.9;
      yaw = glance ? -0.1 : -0.7 + px * 0.08;
      pitch = glance ? 0.45 : 0.05;
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
    } else if (mode === 'projector') {
      yaw = -0.55 + px * 0.15;
      pitch = -0.08 - py * 0.1;
    } else if (mode === 'plane') {
      const p = (t % PLANE_CYCLE) / PLANE_CYCLE;
      // follows its plane once thrown
      yaw = p > PLANE_RELEASE ? -0.5 * Math.min(1, (p - PLANE_RELEASE) * 4) : 0.25 + px * 0.2;
      pitch = p > PLANE_RELEASE ? -0.35 : 0.15 - py * 0.1;
    } else if (mode === 'buddy') {
      yaw = 0.45 + px * 0.2;
      pitch = -py * 0.2;
    } else if (mode === 'build') {
      // look at the block in the hands, then at the top of the tower
      yaw = build.carrying ? (build.u < 0.4 ? 0.1 : -0.55) + px * 0.1 : px * 0.4;
      pitch = build.carrying ? (build.u < 0.4 ? 0.35 : -0.1) : -py * 0.3;
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
      case 'projector': {
        // remote pointed at the screen, with a small "click" at each slide change
        const since = t % SLIDE_TIME;
        const click = since < 0.25 ? Math.sin((since / 0.25) * Math.PI) * 0.25 : 0;
        L = [-1.05 - click, -0.75, -0.25];
        break;
      }
      case 'plane': {
        const p = (t % PLANE_CYCLE) / PLANE_CYCLE;
        if (p < 0.42) R = [-1.1, 0.25 + Math.sin(t * 3) * 0.05, -0.5]; // admiring the plane
        else if (p < 0.52) R = [0.5, 1.2, -1.2]; // wind-up
        else if (p < 0.62) R = [-1.7, 0.35, -0.05]; // throw
        else R = [-0.2, 0.25, -0.2];
        if (p > 0.62 && p < 0.9) L = [0, -2.5 - Math.sin(t * 7) * 0.15, 0]; // waves it goodbye
        break;
      }
      case 'buddy':
        R = [-0.3, 1.45 + Math.sin(t * 3) * 0.08, -0.1];
        if (t % 4 < 1.4) L = [0, -2.5 - Math.sin(t * 8) * 0.15, 0];
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
      case 'build':
        if (build.carrying && build.u < 0.4) {
          // holding the new block in front of the chest
          L = [-1.0, 0.25, -0.55];
          R = [-1.0, -0.25, -0.55];
        } else if (build.carrying) {
          // reaching out to the tower (on the robot's right, the viewer's left)
          L = [-0.55, -1.05 - Math.sin(build.u * Math.PI) * 0.25, -0.15];
          R = [-0.6, -0.1, -0.4];
        }
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
        {arm(-1, lS, lE, leftHandSlot)}
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

// Desk built in the robot's own frame (it faces +z): the keyboard sits right under
// its hands and the monitor stands on its right, turned towards the visitor.
function Desk({ colors }) {
  const keys = useMemo(() => {
    const out = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 10; c++) out.push([-0.32 + c * 0.071, 0.66 - 0.07 + r * 0.07]);
    return out;
  }, []);
  return (
    <group>
      <mesh position={[-0.35, 0.82, 0.9]}>
        <boxGeometry args={[2.0, 0.06, 0.8]} />
        <meshStandardMaterial color={colors.joint} roughness={0.6} />
      </mesh>
      {[-1.28, 0.58].map((x) => (
        <mesh key={x} position={[x, 0.2, 0.9]}>
          <boxGeometry args={[0.06, 1.2, 0.66]} />
          <meshStandardMaterial color={colors.joint} />
        </mesh>
      ))}
      {/* keyboard under the hands */}
      <mesh position={[0, 0.865, 0.66]}>
        <boxGeometry args={[0.8, 0.03, 0.26]} />
        <meshStandardMaterial color="#3b4152" />
      </mesh>
      {keys.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.885, z]}>
          <boxGeometry args={[0.055, 0.012, 0.055]} />
          <meshStandardMaterial color="#1c2029" emissive={colors.accent2} emissiveIntensity={0.18} />
        </mesh>
      ))}
      <Monitor colors={colors} position={[-0.95, 0.06, 1.0]} rotation={[0, 1.3, 0]} scale={0.8} />
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

function usePlaneGeometry() {
  return useMemo(() => {
    const g = new THREE.BufferGeometry();
    // nose, wing tips, centre fold and keel of a folded paper plane
    const v = [0, 0, 0.36, -0.26, 0.02, -0.2, 0, 0, -0.2, 0.26, 0.02, -0.2, 0, -0.09, -0.2];
    g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    g.setIndex([0, 1, 2, 0, 2, 3, 0, 2, 4]);
    g.computeVertexNormals();
    return g;
  }, []);
}

function HeldPlane() {
  const geo = usePlaneGeometry();
  const ref = useRef();
  useFrame((st) => {
    if (!ref.current) return;
    const p = (st.clock.elapsedTime % PLANE_CYCLE) / PLANE_CYCLE;
    ref.current.visible = p < PLANE_RELEASE;
  });
  return (
    <mesh ref={ref} geometry={geo} position={[0, -0.1, 0.18]} rotation={[0.2, 0, 0]}>
      <meshStandardMaterial color="#fbfbf7" side={THREE.DoubleSide} roughness={0.7} />
    </mesh>
  );
}

// The thrown plane: loops up and away to the left, leaving a dotted trail.
function FlyingPlane({ colors }) {
  const geo = usePlaneGeometry();
  const plane = useRef();
  const dots = useRef([]);
  // up and to the left, then away into the distance (it shrinks instead of leaving the frame)
  const at = (f) => new THREE.Vector3(0.45 - 2.4 * f, 1.7 + Math.sin(f * Math.PI) * 0.8 + f * 1.1, 0.5 - 3.2 * f * f);
  useFrame((st) => {
    const p = (st.clock.elapsedTime % PLANE_CYCLE) / PLANE_CYCLE;
    const flying = p >= PLANE_RELEASE;
    const f = flying ? (p - PLANE_RELEASE) / (1 - PLANE_RELEASE) : 0;
    if (plane.current) {
      plane.current.visible = flying;
      plane.current.position.copy(at(f));
      plane.current.lookAt(at(Math.min(1, f + 0.02)));
      plane.current.rotateZ(Math.sin(f * 9) * 0.35);
      plane.current.scale.setScalar(1.1 * (1 - Math.max(0, f - 0.75) * 4));
    }
    dots.current.forEach((d, i) => {
      if (!d) return;
      const back = f - (i + 1) * 0.025;
      d.visible = flying && back > 0;
      if (d.visible) d.position.copy(at(back));
      d.material.opacity = 0.6 * (1 - i / dots.current.length) * (1 - f * 0.6);
    });
  });
  return (
    <group>
      <mesh ref={plane} geometry={geo}>
        <meshStandardMaterial color="#fbfbf7" side={THREE.DoubleSide} roughness={0.7} emissive="#ffffff" emissiveIntensity={0.15} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} ref={(m) => (dots.current[i] = m)}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color={colors.accent2} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function Remote() {
  return (
    <group position={[0, -0.12, 0.12]} rotation={[1.3, 0, 0]}>
      <RoundedBox args={[0.1, 0.3, 0.05]} radius={0.02} smoothness={3}>
        <meshStandardMaterial color="#2b303c" />
      </RoundedBox>
      <mesh position={[0, 0.1, 0.03]}>
        <circleGeometry args={[0.022, 16]} />
        <meshStandardMaterial color="#ff6b81" emissive="#ff6b81" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

// Big floating screen showing the real project screenshots, one after the other.
function ProjectorScreen({ colors }) {
  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return SLIDES.map((id) => {
      const tx = loader.load(`${process.env.PUBLIC_URL}/images/projects/${id}.jpg`);
      tx.colorSpace = THREE.SRGBColorSpace;
      return tx;
    });
  }, []);
  const group = useRef();
  const mat = useRef();
  const screen = useRef();
  useFrame((st) => {
    const t = st.clock.elapsedTime;
    const i = Math.floor(t / SLIDE_TIME) % SLIDES.length;
    const since = t % SLIDE_TIME;
    if (mat.current && mat.current.map !== textures[i]) {
      mat.current.map = textures[i];
      mat.current.needsUpdate = true;
    }
    // quick "switch" when the slide changes
    if (screen.current) screen.current.scale.y = since < 0.18 ? 0.15 + (since / 0.18) * 0.85 : 1;
    if (group.current) group.current.position.y = 2.15 + Math.sin(t * 1.2) * 0.04;
  });
  return (
    <group ref={group} position={[-3.15, 2.15, 0.3]} rotation={[0, 0, 0]}>
      <RoundedBox args={[3.9, 2.02, 0.08]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color={colors.joint} roughness={0.4} metalness={0.4} />
      </RoundedBox>
      <mesh ref={screen} position={[0, 0, 0.045]}>
        <planeGeometry args={[3.74, 1.88]} />
        <meshBasicMaterial ref={mat} map={textures[0]} toneMapped={false} />
      </mesh>
    </group>
  );
}

function useBlockTexture(label, bg, fg) {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    g.fillStyle = bg;
    g.fillRect(0, 0, 256, 256);
    g.strokeStyle = 'rgba(255,255,255,0.18)';
    g.lineWidth = 10;
    g.strokeRect(5, 5, 246, 246);
    g.fillStyle = fg;
    g.font = `bold ${label.length > 6 ? 54 : 64}px Inter, Segoe UI, sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(label, 128, 132);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, [label, bg, fg]);
}

function TechBlock({ label, bg, fg, blockRef }) {
  const map = useBlockTexture(label, bg, fg);
  return (
    <mesh ref={blockRef} scale={0}>
      <boxGeometry args={[0.42, 0.42, 0.42]} />
      <meshStandardMaterial map={map} roughness={0.45} metalness={0.1} emissive={bg} emissiveIntensity={0.12} />
    </mesh>
  );
}

const easeInOut = (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);

function BuildTower({ still }) {
  const refs = useRef([]);
  const S = 0.42;
  const base = new THREE.Vector3(-1.1, -0.17, 0.3); // first block centre, left of the robot
  const hands = new THREE.Vector3(-0.12, 1.12, 0.7); // in front of the robot's chest
  // random-looking but fixed fall directions
  const fall = useMemo(() => BUILD_BLOCKS.map((_, i) => [Math.sin(i * 2.3) * 1.2 - 0.4, 1.2 + (i % 3) * 0.5, Math.cos(i * 1.7) * 0.8, (i % 2 ? 1 : -1) * (2 + i)]), []);

  useFrame((state) => {
    const t = still ? BUILD_BLOCKS.length * BUILD_STEP + 0.01 : state.clock.elapsedTime % BUILD_CYCLE;
    const buildEnd = BUILD_BLOCKS.length * BUILD_STEP;
    const k = Math.floor(t / BUILD_STEP);
    const u = (t % BUILD_STEP) / BUILD_STEP;
    build.carrying = t < buildEnd;
    build.u = u;

    refs.current.forEach((m, i) => {
      if (!m) return;
      const top = new THREE.Vector3(base.x, base.y + S / 2 + i * S, base.z);
      if (t >= buildEnd + BUILD_HOLD) {
        // collapse: fly out, spin, shrink
        const f = (t - buildEnd - BUILD_HOLD) / BUILD_FALL;
        const [vx, vy, vz, spin] = fall[i];
        m.position.set(top.x + vx * f, top.y + vy * f - 3.2 * f * f, top.z + vz * f);
        m.rotation.set(spin * f, spin * 0.6 * f, spin * 0.4 * f);
        m.scale.setScalar(Math.max(0, 1 - f * f));
      } else if (i < k || (still && i <= k)) {
        // placed: tiny settle wobble right after landing
        const since = t - (i + 1) * BUILD_STEP;
        const wob = since > 0 && since < 0.35 ? Math.sin(since * 30) * 0.03 * (1 - since / 0.35) : 0;
        m.position.copy(top);
        m.rotation.set(0, 0, wob);
        m.scale.setScalar(1);
      } else if (i === k) {
        if (u < 0.4) {
          // appears in the hands
          const a = Math.min(1, u / 0.15);
          m.position.copy(hands);
          m.position.y += Math.sin(u * 20) * 0.01;
          m.rotation.set(0, u * 2, 0);
          m.scale.setScalar(a);
        } else {
          // arc over to the top of the tower
          const v = easeInOut(Math.min(1, (u - 0.4) / 0.5));
          m.position.lerpVectors(hands, top, v);
          m.position.y += Math.sin(v * Math.PI) * 0.6;
          m.rotation.set(0, (1 - v) * 0.8, 0);
          m.scale.setScalar(1);
        }
      } else {
        m.scale.setScalar(0);
      }
    });
  });

  return (
    <group>
      {/* stone pad under the tower */}
      <mesh position={[base.x, base.y - 0.04, base.z]}>
        <cylinderGeometry args={[0.38, 0.42, 0.06, 32]} />
        <meshStandardMaterial color="#3a3550" roughness={0.9} />
      </mesh>
      {BUILD_BLOCKS.map(([label, bg, fg], i) => (
        <TechBlock key={label} label={label} bg={bg} fg={fg} blockRef={(m) => (refs.current[i] = m)} />
      ))}
    </group>
  );
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

// The planet each page's robot stands on: the one it flew to from the home page.



function PlanetFloor({ cfg }) {
  const spin = useRef();
  const clouds = useRef();
  const map = usePlanetTexture(cfg.kind, cfg.seed);
  const cloudMap = usePlanetTexture('clouds', 5);
  const ringMap = useRingTexture();
  const ringGeo = useRingGeometry(PLANET_R * 1.25, PLANET_R * 1.75);
  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 0.05;
    if (clouds.current) clouds.current.rotation.y += dt * 0.07;
  });
  return (
    <group position={[0, -PLANET_R, 0]}>
      {/* poles point sideways so the equator rolls under the robot */}
      <group rotation={[0, 0, Math.PI / 2]}>
      <group ref={spin}>
        <mesh>
          <sphereGeometry args={[PLANET_R, 96, 96]} />
          <meshStandardMaterial
            map={map}
            roughness={cfg.kind === 'ice' ? 0.35 : 0.85}
            emissive={cfg.lava ? '#ff4d2e' : '#000000'}
            emissiveMap={cfg.lava ? map : null}
            emissiveIntensity={cfg.lava ? 0.35 : 0}
          />
        </mesh>
      </group>
      {cfg.clouds && (
        <mesh ref={clouds} scale={1.012}>
          <sphereGeometry args={[PLANET_R, 96, 96]} />
          <meshStandardMaterial map={cloudMap} transparent depthWrite={false} roughness={1} />
        </mesh>
      )}
      </group>
      <Atmosphere radius={PLANET_R} color={cfg.glow} scale={1.07} power={1.4} intensity={0.9} />
      {cfg.ring && (
        <mesh geometry={ringGeo} rotation={[Math.PI / 2 - 0.18, 0, 0.12]}>
          <meshStandardMaterial map={ringMap} transparent side={THREE.DoubleSide} depthWrite={false} emissive="#67e8f9" emissiveMap={ringMap} emissiveIntensity={0.35} />
        </mesh>
      )}
    </group>
  );
}



function Scene({ mode, theme, still }) {
  useWindowInput();
  const colors = PALETTE[theme] || PALETTE.dark;
  const L = LAYOUT[mode] || LAYOUT.hello;
  const robot = useRef();
  const { camera } = useThree();

  const planet = PAGE_PLANET[mode];
  useEffect(() => {
    camera.position.set(L.cam[0], L.cam[1] + (planet ? 0.4 : 0), L.cam[2] + (planet ? 0.6 : 0));
    camera.lookAt(L.cam[0] * 0.5, planet ? 1.15 : 1.55, 0);
  }, [camera, L, planet]);

  useFrame((_, dt) => {
    if (!robot.current) return;
    robot.current.rotation.y = damp(robot.current.rotation.y, L.rot + input.x * (mode === 'type' ? 0 : 0.25), 2.5, dt);
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
          rightHandSlot={mode === 'mail' ? <Envelope colors={colors} /> : mode === 'plane' ? <HeldPlane /> : null}
          leftHandSlot={mode === 'projector' ? <Remote /> : null}
          bothHandsSlot={mode === 'play' ? <Controller colors={colors} /> : null}
        />
        <Shadow />
        {planet && <PlanetFloor cfg={planet} />}
        {mode === 'juggle' && <JuggleOrbs colors={colors} />}
        {mode === 'build' && <BuildTower still={still} />}
        {mode === 'plane' && <FlyingPlane colors={colors} />}
        {mode === 'projector' && <ProjectorScreen colors={colors} />}
        {mode === 'lost' && <QuestionMark colors={colors} />}
      </group>

      {mode === 'hello' && <Monitor colors={colors} position={[-1.35, 0, -0.6]} rotation={[0, 0.35, 0]} />}
      {mode === 'type' && (
        <group position={L.robot} rotation={[0, L.rot, 0]}>
          <Desk colors={colors} />
        </group>
      )}
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
  const still = useStill();
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
        <Scene mode={mode} theme={theme} still={still} />
      </Canvas>
    </WebGLBoundary>
  );
}
