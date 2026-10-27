import { Component, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useStill } from '../context';
import { input, PALETTE, Robot, useWindowInput } from './Robot3D';
import { skipNextFlight } from './RocketFlight';
import { Atmosphere, Glow, SunSurface, usePlanetTexture, useRingGeometry, useRingTexture } from './spaceMaterials';

/*
 * Home page "solar system": each planet is a page of the site.
 * Clicking a planet (or its label) flies the camera there, then navigates.
 */

const PLANETS = [
  { key: 'about', kind: 'terra', glow: '#6fb6ff', radius: 2.4, size: 0.32, speed: 0.3, start: 0.4, tilt: 0.4, clouds: true, moon: true },
  { key: 'experience', kind: 'gas', glow: '#ffc27a', radius: 3.3, size: 0.42, speed: 0.22, start: 2.1, tilt: 0.05 },
  { key: 'projects', kind: 'ringed', glow: '#67e8f9', radius: 4.3, size: 0.46, speed: 0.16, start: 3.6, tilt: 0.45, ring: true },
  { key: 'skills', kind: 'lava', glow: '#ff7a9a', radius: 5.3, size: 0.34, speed: 0.12, start: 5.0, tilt: 0.2 },
  { key: 'contact', kind: 'ice', glow: '#c4b5fd', radius: 6.2, size: 0.3, speed: 0.09, start: 0.9, tilt: 0.3 },
];

const damp = THREE.MathUtils.damp;

function OrbitLine({ radius, color }) {
  const geo = useMemo(() => {
    const pts = new THREE.EllipseCurve(0, 0, radius, radius).getPoints(160).map((p) => new THREE.Vector3(p.x, 0, p.y));
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius]);
  return (
    <lineLoop geometry={geo}>
      <lineBasicMaterial color={color} transparent opacity={0.35} />
    </lineLoop>
  );
}

function Moon() {
  const pivot = useRef();
  const map = usePlanetTexture('moon', 3);
  useFrame((_, dt) => {
    if (pivot.current) pivot.current.rotation.y += dt * 0.9;
  });
  return (
    <group ref={pivot} rotation={[0.3, 0, 0]}>
      <mesh position={[0.62, 0, 0]}>
        <sphereGeometry args={[0.07, 24, 24]} />
        <meshStandardMaterial map={map} roughness={1} />
      </mesh>
    </group>
  );
}

function Ring({ size }) {
  const map = useRingTexture();
  const geo = useRingGeometry(size * 1.35, size * 2.3);
  return (
    <mesh geometry={geo} rotation={[Math.PI / 2 - 0.35, 0, 0]}>
      <meshStandardMaterial map={map} transparent side={THREE.DoubleSide} depthWrite={false} roughness={0.8} emissive="#67e8f9" emissiveMap={map} emissiveIntensity={0.35} />
    </mesh>
  );
}

function Planet({ p, focus, hovered, setHovered, onPick, posRef }) {
  const group = useRef();
  const spin = useRef();
  const cloudRef = useRef();
  const angle = useRef(p.start);
  const isFocus = focus === p.key;
  const map = usePlanetTexture(p.kind, p.key.length * 13);
  const cloudMap = usePlanetTexture('clouds', 5);
  useFrame((_, dt) => {
    if (!isFocus) angle.current += dt * p.speed;
    group.current.position.set(Math.cos(angle.current) * p.radius, 0, Math.sin(angle.current) * p.radius);
    spin.current.rotation.y += dt * (p.kind === 'gas' ? 0.6 : 0.35);
    if (cloudRef.current) cloudRef.current.rotation.y += dt * 0.12;
    const s = hovered === p.key || isFocus ? 1.22 : 1;
    group.current.scale.setScalar(damp(group.current.scale.x, s, 6, dt));
    posRef.current[p.key] = group.current.position;
  });
  const hot = hovered === p.key;
  return (
    <group ref={group}>
      <group rotation={[0, 0, p.tilt]}>
        <group ref={spin}>
          <mesh
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(p.key);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHovered(null);
              document.body.style.cursor = '';
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (e.delta > 6) return;
              onPick(p.key);
            }}
          >
            <sphereGeometry args={[p.size, 64, 64]} />
            <meshStandardMaterial
              map={map}
              roughness={p.kind === 'ice' ? 0.35 : 0.85}
              metalness={0.05}
              emissive={p.kind === 'lava' ? '#ff4d2e' : p.glow}
              emissiveMap={p.kind === 'lava' ? map : null}
              emissiveIntensity={p.kind === 'lava' ? 0.35 : hot ? 0.18 : 0.04}
            />
          </mesh>
          {p.clouds && (
            <mesh ref={cloudRef} scale={1.03}>
              <sphereGeometry args={[p.size, 64, 64]} />
              <meshStandardMaterial map={cloudMap} transparent depthWrite={false} roughness={1} />
            </mesh>
          )}
        </group>
        {p.ring && <Ring size={p.size} />}
      </group>
      <Atmosphere radius={p.size} color={p.glow} scale={1.22} power={hot ? 1.1 : 1.6} intensity={hot ? 1.5 : 0.9} />
      {p.moon && <Moon />}
    </group>
  );
}

function Sun() {
  return (
    <group>
      <SunSurface radius={0.85} />
      <Atmosphere radius={0.85} color="#ffb347" scale={1.35} power={2.2} intensity={1.6} />
      <Atmosphere radius={0.85} color="#ff6a1a" scale={1.9} power={3} intensity={0.8} />
      <Glow color="#ffb05a" size={5.2} opacity={0.5} />
      <pointLight intensity={38} distance={40} decay={1.6} color="#fff1d6" />
    </group>
  );
}

// Small rocket (nose along +z) with the robot's face in the cockpit window.
function Rocket({ colors, flame }) {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.8, 24]} />
        <meshStandardMaterial color="#eef1f7" roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.2, 0.36, 24]} />
        <meshStandardMaterial color={colors.accent} roughness={0.4} />
      </mesh>
      {/* cockpit with the robot's visor and eyes */}
      <mesh position={[0, 0.15, 0.12]}>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshStandardMaterial color="#0b0d12" roughness={0.1} metalness={0.5} />
      </mesh>
      {[-0.04, 0.04].map((x) => (
        <mesh key={x} position={[x, 0.2, 0.2]}>
          <boxGeometry args={[0.025, 0.05, 0.02]} />
          <meshStandardMaterial color={colors.eye} emissive={colors.eye} emissiveIntensity={2} />
        </mesh>
      ))}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[Math.cos((i * Math.PI * 2) / 3) * 0.24, Math.sin((i * Math.PI * 2) / 3) * 0.24, -0.32]} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
          <boxGeometry args={[0.18, 0.03, 0.22]} />
          <meshStandardMaterial color="#ff5c7a" />
        </mesh>
      ))}
      <mesh ref={flame} position={[0, 0, -0.62]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.13, 0.42, 16]} />
        <meshBasicMaterial color="#ffb347" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

const FLY_TIME = 1.05; // seconds, the page opens right after (1100 ms)

function Astronaut({ colors, focus, posRef }) {
  const group = useRef();
  const robot = useRef();
  const rocket = useRef();
  const flame = useRef();
  const flyStart = useRef(null);
  const home = useMemo(() => new THREE.Vector3(1.75, 0.35, 0.9), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const from = useMemo(() => new THREE.Vector3(), []);
  const mid = useMemo(() => new THREE.Vector3(), []);
  const at = (f, out) => {
    // quadratic bezier from the robot's spot, arcing up, down onto the planet
    const u = 1 - f;
    return out.set(
      u * u * from.x + 2 * u * f * mid.x + f * f * target.x,
      u * u * from.y + 2 * u * f * mid.y + f * f * target.y,
      u * u * from.z + 2 * u * f * mid.z + f * f * target.z
    );
  };
  const next = useMemo(() => new THREE.Vector3(), []);

  useFrame((s, dt) => {
    const t = s.clock.elapsedTime;
    const planet = focus && posRef.current[focus];
    if (!planet) {
      flyStart.current = null;
      target.copy(home).setY(home.y + Math.sin(t * 1.6) * 0.08);
      group.current.position.lerp(target, Math.min(1, dt * 3));
      group.current.visible = true;
      if (rocket.current) rocket.current.visible = false;
      if (robot.current) robot.current.rotation.y = damp(robot.current.rotation.y, -0.5 + input.x * 0.4, 3, dt);
      return;
    }
    // the robot boards its rocket and flies to the planet
    if (flyStart.current === null) {
      flyStart.current = t;
      from.copy(group.current.position).add(new THREE.Vector3(0, 0.6, 0));
    }
    const p = PLANETS.find((x) => x.key === focus);
    target.copy(planet).add(new THREE.Vector3(0, p.size * 1.1, 0));
    mid.copy(from).lerp(target, 0.5).add(new THREE.Vector3(0, 1.6, 0));
    const f = Math.min(1, (t - flyStart.current) / FLY_TIME);
    const e = f < 0.5 ? 2 * f * f : 1 - (-2 * f + 2) ** 2 / 2;
    group.current.visible = false;
    if (rocket.current) {
      rocket.current.visible = true;
      at(e, rocket.current.position);
      rocket.current.lookAt(at(Math.min(1, e + 0.03), next));
      rocket.current.scale.setScalar(0.55 - e * 0.25);
    }
    if (flame.current) flame.current.scale.set(1, 0.8 + Math.sin(t * 40) * 0.25, 1);
  });

  return (
    <>
      <group ref={group} scale={0.42}>
        <Robot mode="hello" colors={colors} robotRef={robot} />
        <mesh position={[0, 2.2, 0]}>
          <sphereGeometry args={[0.72, 32, 32]} />
          <meshStandardMaterial color={colors.accent2} transparent opacity={0.16} roughness={0.05} />
        </mesh>
      </group>
      <group ref={rocket} visible={false}>
        <Rocket colors={colors} flame={flame} />
      </group>
    </>
  );
}

// Outermost orbit plus the planet and a small margin, in world units.
const SYSTEM_RADIUS = PLANETS[PLANETS.length - 1].radius + 0.8;

// Camera distance that keeps every orbit on screen. The system is pushed
// sideways by `shift`, which leaves less room on one side, and it looks
// flatter vertically the lower the camera pitch.
function fitDistance(fov, aspect, shift, pitch) {
  const t = Math.tan(THREE.MathUtils.degToRad(fov / 2));
  const sideRoom = Math.max(0.35, 1 - 2 * Math.abs(shift));
  const horizontal = SYSTEM_RADIUS / (t * aspect * sideRoom);
  const vertical = (SYSTEM_RADIUS * (0.25 + 0.75 * Math.sin(pitch))) / t;
  return Math.max(9, horizontal, vertical) * 1.08;
}

function Rig({ focus, posRef, shift, drag }) {
  const { camera, size } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);
  const offset = useRef(shift);
  const wantPos = useMemo(() => new THREE.Vector3(), []);
  const wantLook = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    const planet = focus && posRef.current[focus];
    if (planet) {
      const p = PLANETS.find((x) => x.key === focus);
      const dir = planet.clone().normalize();
      wantPos.copy(planet).add(dir.multiplyScalar(p.size * 6 + 1.4)).add(new THREE.Vector3(0, p.size * 2.5 + 0.6, 0));
      wantLook.copy(planet);
    } else {
      const d = drag.current;
      if (!d.active) {
        // slow auto-rotation plus the inertia left over from the last drag
        d.yaw += dt * 0.04 + d.vel;
        d.vel *= Math.pow(0.04, dt);
      }
      const dist = fitDistance(camera.fov, size.width / size.height, offset.current, d.pitch);
      wantPos.set(Math.sin(d.yaw) * Math.cos(d.pitch) * dist, Math.sin(d.pitch) * dist, Math.cos(d.yaw) * Math.cos(d.pitch) * dist);
      wantLook.set(0, 0, 0);
    }
    const k = Math.min(1, dt * (planet ? 2.4 : drag.current.active ? 8 : 4));
    camera.position.lerp(wantPos, k);
    look.lerp(wantLook, k);
    camera.lookAt(look);
    // push the system to the right so the text column on the left stays readable
    offset.current = damp(offset.current, planet ? 0 : shift, 3, dt);
    camera.setViewOffset(size.width, size.height, -size.width * offset.current, 0, size.width, size.height);
  });
  return null;
}

// Moves the DOM labels (outside the canvas) to follow their planets.
function LabelProjector({ posRef, labelRefs, focus }) {
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    PLANETS.forEach((p) => {
      const el = labelRefs.current[p.key];
      const pos = posRef.current[p.key];
      if (!el || !pos) return;
      v.copy(pos);
      v.y += p.size + 0.35;
      v.project(camera);
      const show = v.z < 1 && !focus;
      el.style.opacity = show ? '1' : '0';
      el.style.pointerEvents = show ? 'auto' : 'none';
      el.style.transform = `translate(-50%, -50%) translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px)`;
    });
  });
  return null;
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

export default function SpaceHero({ theme, labels, onNavigate, onFly, shift = 0 }) {
  useWindowInput();
  const colors = PALETTE[theme] || PALETTE.dark;
  const [focus, setFocus] = useState(null);
  const [hovered, setHovered] = useState(null);
  const posRef = useRef({});
  const labelRefs = useRef({});
  const still = useStill();

  useEffect(() => () => (document.body.style.cursor = ''), []);

  // Drag to rotate the system (mouse, pen, and horizontal swipes on touch).
  const drag = useRef({ yaw: 0.5, pitch: 0.5, vel: 0, active: false, x: 0, y: 0 });
  const [grabbing, setGrabbing] = useState(false);
  useEffect(() => {
    const move = (e) => {
      const d = drag.current;
      if (!d.active) return;
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      d.x = e.clientX;
      d.y = e.clientY;
      d.vel = -dx * 0.0055;
      d.yaw += d.vel;
      d.pitch = THREE.MathUtils.clamp(d.pitch + dy * 0.004, 0.12, 1.25);
    };
    const up = () => {
      drag.current.active = false;
      setGrabbing(false);
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, []);
  const startDrag = (e) => {
    if (focus || e.target.closest('.planet-label')) return;
    Object.assign(drag.current, { active: true, x: e.clientX, y: e.clientY, vel: 0 });
    setGrabbing(true);
  };

  const pick = (key) => {
    if (focus) return;
    setFocus(key);
    onFly?.(key);
    // the rocket ride happens here, so the page transition does not repeat it
    skipNextFlight();
    setTimeout(() => onNavigate(key), still ? 0 : 1100);
  };

  return (
    <WebGLBoundary>
      <div className={`space-drag ${grabbing ? 'is-grabbing' : ''}`} onPointerDown={startDrag}>
      <div className="planet-labels">
        {PLANETS.map((p) => (
          <button
            key={p.key}
            type="button"
            ref={(el) => (labelRefs.current[p.key] = el)}
            className={`planet-label ${hovered === p.key ? 'is-hover' : ''}`}
            onClick={() => pick(p.key)}
            onPointerEnter={() => setHovered(p.key)}
            onPointerLeave={() => setHovered(null)}
          >
            {labels[p.key]}
          </button>
        ))}
      </div>
      <Canvas
        className="space-canvas"
        camera={{ position: [6, 6, 10], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        frameloop={still ? 'demand' : 'always'}
        onPointerMissed={() => setHovered(null)}
      >
        <ambientLight intensity={theme === 'light' ? 0.8 : 0.45} />
        <directionalLight position={[6, 8, 10]} intensity={1.3} />
        <Stars radius={60} depth={30} count={theme === 'light' ? 0 : 2200} factor={3} fade speed={0.6} />
        <group>
          <Sun />
          {PLANETS.map((p) => (
            <OrbitLine key={p.key} radius={p.radius} color={theme === 'light' ? '#b4b2a9' : '#444441'} />
          ))}
          {PLANETS.map((p) => (
            <Planet key={p.key} p={p} focus={focus} hovered={hovered} setHovered={setHovered} onPick={pick} posRef={posRef} />
          ))}
          <Astronaut colors={colors} focus={focus} posRef={posRef} />
        </group>
        <Rig focus={focus} posRef={posRef} shift={shift} drag={drag} />
        <LabelProjector posRef={posRef} labelRefs={labelRefs} focus={focus} />
      </Canvas>
      </div>
    </WebGLBoundary>
  );
}
