import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/*
 * Procedural looks for the home-page solar system: an animated sun shader,
 * fresnel atmospheres and canvas-generated planet textures (no image files).
 */

// ---------- small seeded 3D value noise for the canvas textures ----------
function makeNoise(seed) {
  const perm = new Uint8Array(512);
  let s = seed >>> 0 || 1;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const val = new Float32Array(256).map(() => rnd());
  const h = (x, y, z) => val[perm[(perm[(perm[x & 255] + y) & 255] + z) & 255]];
  const fade = (t) => t * t * (3 - 2 * t);
  const noise = (x, y, z) => {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const xf = fade(x - xi), yf = fade(y - yi), zf = fade(z - zi);
    const l = (a, b, t) => a + (b - a) * t;
    return l(
      l(l(h(xi, yi, zi), h(xi + 1, yi, zi), xf), l(h(xi, yi + 1, zi), h(xi + 1, yi + 1, zi), xf), yf),
      l(l(h(xi, yi, zi + 1), h(xi + 1, yi, zi + 1), xf), l(h(xi, yi + 1, zi + 1), h(xi + 1, yi + 1, zi + 1), xf), yf),
      zf
    );
  };
  return (x, y, z, oct = 5) => {
    let sum = 0, amp = 0.5, f = 1, norm = 0;
    for (let i = 0; i < oct; i++) {
      sum += amp * noise(x * f, y * f, z * f);
      norm += amp;
      amp *= 0.5;
      f *= 2;
    }
    return sum / norm;
  };
}

const hex = (c) => new THREE.Color(c);
const mix = (a, b, t) => a.clone().lerp(b, Math.min(1, Math.max(0, t)));

// Paints an equirectangular texture; `shade(nx, ny, nz, lat)` returns a THREE.Color.
function paint(width, height, shade) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const g = canvas.getContext('2d');
  const img = g.createImageData(width, height);
  for (let y = 0; y < height; y++) {
    const lat = (y / height) * Math.PI; // 0..PI
    const sy = Math.cos(lat);
    const r = Math.sin(lat);
    for (let x = 0; x < width; x++) {
      const lon = (x / width) * Math.PI * 2;
      const c = shade(Math.cos(lon) * r, sy, Math.sin(lon) * r, lat);
      const i = (y * width + x) * 4;
      img.data[i] = c.r * 255;
      img.data[i + 1] = c.g * 255;
      img.data[i + 2] = c.b * 255;
      img.data[i + 3] = c.a === undefined ? 255 : c.a * 255;
    }
  }
  g.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

const W = 512;
const H = 256;

const PLANET_PAINTERS = {
  // Earth-like: oceans, continents, polar ice
  terra: (seed) => {
    const n = makeNoise(seed);
    const deep = hex('#0b3d91'), shallow = hex('#2f7fd8'), sand = hex('#d9c89a'), grass = hex('#3f8f4f'), forest = hex('#24603a'), rock = hex('#8a7a66'), ice = hex('#f2f6ff');
    return paint(W, H, (x, y, z, lat) => {
      const e = n(x * 1.8 + 7, y * 1.8, z * 1.8, 6);
      const polar = Math.abs(Math.cos(lat));
      if (polar > 0.88 - (e - 0.5) * 0.2) return ice;
      if (e < 0.5) return mix(deep, shallow, (e - 0.3) / 0.2);
      if (e < 0.52) return sand;
      if (e < 0.6) return mix(grass, forest, (e - 0.52) / 0.08);
      return mix(forest, rock, (e - 0.6) / 0.12);
    });
  },
  clouds: (seed) => {
    const n = makeNoise(seed + 99);
    return paint(W, H, (x, y, z) => {
      const c = n(x * 2.5, y * 4, z * 2.5, 5);
      const a = Math.max(0, (c - 0.52) * 3.2);
      const col = new THREE.Color(1, 1, 1);
      col.a = Math.min(0.85, a);
      return col;
    });
  },
  // Jupiter-like gas giant with bands and a storm
  gas: (seed) => {
    const n = makeNoise(seed);
    const stops = ['#f6e2b8', '#d9a35f', '#b8733a', '#f0c98a', '#8f5a32', '#e8b979'].map(hex);
    return paint(W, H, (x, y, z, lat) => {
      const turb = n(x * 3, y * 6, z * 3, 5) - 0.5;
      const band = (Math.cos(lat) * 7 + turb * 1.6 + 10) % stops.length;
      const i = Math.floor(band);
      let c = mix(stops[i], stops[(i + 1) % stops.length], band - i);
      // great storm
      const dx = x - 0.75, dy = y + 0.3, dz = z - 0.55;
      const d = Math.sqrt(dx * dx + dy * dy * 3 + dz * dz);
      if (d < 0.22) c = mix(c, hex('#c4502e'), 1 - d / 0.22);
      return c;
    });
  },
  // cyan banded planet for the ringed one
  ringed: (seed) => {
    const n = makeNoise(seed);
    const a = hex('#0c4f6e'), b = hex('#22d3ee'), c = hex('#a5f3fc');
    return paint(W, H, (x, y, z, lat) => {
      const t = Math.cos(lat) * 5 + (n(x * 2, y * 5, z * 2, 4) - 0.5) * 2.2;
      const s = (Math.sin(t * 2.2) + 1) / 2;
      return s < 0.5 ? mix(a, b, s * 2) : mix(b, c, (s - 0.5) * 2);
    });
  },
  // rocky world with craters and glowing lava cracks
  lava: (seed) => {
    const n = makeNoise(seed);
    const n2 = makeNoise(seed + 7);
    const dark = hex('#2a1420'), rock = hex('#6b2f45'), dust = hex('#b85c7d'), lava = hex('#ff6a3d');
    return paint(W, H, (x, y, z) => {
      const e = n(x * 3, y * 3, z * 3, 6);
      let c = e < 0.45 ? mix(dark, rock, e / 0.45) : mix(rock, dust, (e - 0.45) / 0.25);
      const crack = Math.abs(n2(x * 4, y * 4, z * 4, 4) - 0.5);
      if (crack < 0.022) c = mix(lava, c, crack / 0.022);
      return c;
    });
  },
  // icy violet world
  ice: (seed) => {
    const n = makeNoise(seed);
    const deep = hex('#3b2a7a'), mid = hex('#8b7cf0'), frost = hex('#e9e4ff');
    return paint(W, H, (x, y, z) => {
      const e = n(x * 2.2, y * 2.2, z * 2.2, 6);
      const streak = (Math.sin((x + y * 0.6) * 18 + e * 6) + 1) / 2;
      const c = e < 0.5 ? mix(deep, mid, e / 0.5) : mix(mid, frost, (e - 0.5) / 0.3);
      return mix(c, frost, streak * 0.18);
    });
  },
  moon: (seed) => {
    const n = makeNoise(seed);
    const a = hex('#5d5d66'), b = hex('#c9c9d1');
    return paint(256, 128, (x, y, z) => mix(a, b, n(x * 4, y * 4, z * 4, 5)));
  },
};

const cache = {};
export function usePlanetTexture(kind, seed = 1) {
  return useMemo(() => {
    const key = `${kind}:${seed}`;
    if (!cache[key]) cache[key] = PLANET_PAINTERS[kind](seed);
    return cache[key];
  }, [kind, seed]);
}

// Detailed ring with gaps, painted along its radius.
export function useRingTexture() {
  return useMemo(() => {
    if (cache.ring) return cache.ring;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 8;
    const g = canvas.getContext('2d');
    const n = makeNoise(42);
    for (let x = 0; x < 512; x++) {
      const t = x / 512;
      let a = 0.25 + n(t * 40, 0.5, 0.5, 3) * 0.75;
      if (t > 0.42 && t < 0.47) a *= 0.08; // Cassini-like gap
      if (t < 0.04 || t > 0.97) a *= t < 0.04 ? t / 0.04 : (1 - t) / 0.03;
      const light = 0.75 + n(t * 90, 2, 2, 2) * 0.25;
      g.fillStyle = `rgba(${Math.round(200 * light)}, ${Math.round(240 * light)}, ${Math.round(250 * light)}, ${a.toFixed(3)})`;
      g.fillRect(x, 0, 1, 8);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    cache.ring = tex;
    return tex;
  }, []);
}

// RingGeometry with UVs remapped so u runs from inner to outer radius.
export function useRingGeometry(inner, outer) {
  return useMemo(() => {
    const geo = new THREE.RingGeometry(inner, outer, 128, 1);
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      uv.setXY(i, (v.length() - inner) / (outer - inner), 0.5);
    }
    return geo;
  }, [inner, outer]);
}

// ---------- GLSL ----------
const NOISE_GLSL = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){float s=0.0;float a=0.5;for(int i=0;i<5;i++){s+=a*snoise(p);p*=2.02;a*=0.5;}return s;}
`;

// Boiling sun surface with limb darkening.
export function SunSurface({ radius = 0.85 }) {
  const mat = useRef();
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((_, dt) => {
    uniforms.uTime.value += dt;
  });
  return (
    <mesh>
      <sphereGeometry args={[radius, 96, 96]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        toneMapped={false}
        vertexShader={`
          varying vec3 vPos; varying vec3 vNormal; varying vec3 vView;
          void main(){
            vPos = position;
            vNormal = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position,1.0);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }`}
        fragmentShader={`
          uniform float uTime; varying vec3 vPos; varying vec3 vNormal; varying vec3 vView;
          ${NOISE_GLSL}
          void main(){
            vec3 p = normalize(vPos) * 2.6;
            float t = uTime * 0.12;
            float n = fbm(p + vec3(t, -t * 0.7, t * 0.4));
            float cells = fbm(p * 3.2 - vec3(t * 1.6));
            float heat = clamp(0.55 + n * 0.55 + cells * 0.25, 0.0, 1.0);
            vec3 deep = vec3(0.85, 0.22, 0.02);
            vec3 mid = vec3(1.0, 0.55, 0.08);
            vec3 hot = vec3(1.0, 0.92, 0.6);
            vec3 col = mix(deep, mid, smoothstep(0.15, 0.6, heat));
            col = mix(col, hot, smoothstep(0.6, 1.0, heat));
            float limb = pow(max(dot(vNormal, vView), 0.0), 0.45);
            col *= 0.55 + 0.75 * limb;
            gl_FragColor = vec4(col * 1.25, 1.0);
          }`}
      />
    </mesh>
  );
}

// Additive fresnel shell used for the sun corona and planet atmospheres.
export function Atmosphere({ radius, color = '#ffb347', power = 2.5, intensity = 1, scale = 1.25 }) {
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(color) }, uPower: { value: power }, uIntensity: { value: intensity } }),
    [color, power, intensity]
  );
  return (
    <mesh scale={scale}>
      <sphereGeometry args={[radius, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        toneMapped={false}
        vertexShader={`
          varying vec3 vNormal; varying vec3 vView;
          void main(){
            vNormal = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position,1.0);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }`}
        fragmentShader={`
          uniform vec3 uColor; uniform float uPower; uniform float uIntensity;
          varying vec3 vNormal; varying vec3 vView;
          void main(){
            // back faces: strongest next to the body, fading out to the shell edge
            float f = pow(clamp(-dot(vNormal, vView), 0.0, 1.0), uPower);
            gl_FragColor = vec4(uColor * f * uIntensity, f * uIntensity);
          }`}
      />
    </mesh>
  );
}

// Soft radial glow sprite (cheap "bloom").
export function Glow({ color = '#ffb347', size = 4, opacity = 0.55 }) {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.25, 'rgba(255,255,255,0.45)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  const ref = useRef();
  useFrame((s) => {
    if (ref.current) ref.current.scale.setScalar(size * (1 + Math.sin(s.clock.elapsedTime * 1.7) * 0.04));
  });
  return (
    <sprite ref={ref} scale={size}>
      <spriteMaterial map={tex} color={color} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </sprite>
  );
}
