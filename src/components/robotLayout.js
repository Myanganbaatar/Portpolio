// Where each page's robot stands and on which planet, shared by the 3D scene
// (Robot3D) and the rocket page transition (no three.js import here).

export const PAGE_PLANET = {
  globe: { kind: 'terra', seed: 65, glow: '#6fb6ff', clouds: true },
  type: { kind: 'gas', seed: 130, glow: '#ffc27a' },
  present: { kind: 'ringed', seed: 104, glow: '#67e8f9', ring: true },
  juggle: { kind: 'lava', seed: 78, glow: '#ff7a9a', lava: true },
  build: { kind: 'lava', seed: 78, glow: '#ff7a9a', lava: true },
  mail: { kind: 'ice', seed: 91, glow: '#c4b5fd' },
  plane: { kind: 'ice', seed: 91, glow: '#c4b5fd' },
  projector: { kind: 'ringed', seed: 104, glow: '#67e8f9', ring: true },
  play: { kind: 'gas', seed: 130, glow: '#ffc27a' },
  lost: { kind: 'moon', seed: 3, glow: '#9aa1b3' },
};
export const PLANET_R = 2.6;

export const LAYOUT = {
  hello: { robot: [0.55, 0, 0], rot: -0.15, cam: [0, 1.9, 6.6] },
  type: { robot: [0.75, 0, 0], rot: -0.75, cam: [0.2, 2.2, 6.4] },
  present: { robot: [0, 0, 0], rot: 0, cam: [0, 2, 6.8] },
  juggle: { robot: [0, 0, 0], rot: 0, cam: [0, 2.1, 6.4] },
  build: { robot: [0.45, 0, 0], rot: -0.35, cam: [-0.25, 2.2, 6.6] },
  mail: { robot: [0, 0, 0], rot: 0.15, cam: [0, 1.9, 5.8] },
  plane: { robot: [0.55, 0, 0], rot: 0.1, cam: [-0.3, 2.0, 6.4] },
  projector: { robot: [2.75, 0, 0], rot: -0.6, cam: [0, 2.0, 7.2] },
  buddy: { robot: [0, 0, 0], rot: 0.35, cam: [0, 1.75, 5.2] },
  play: { robot: [0, 0, 0], rot: 0, cam: [0, 1.9, 5.6] },
  globe: { robot: [0.65, 0, 0], rot: -0.25, cam: [-0.3, 1.9, 6.4] },
  lost: { robot: [0, 0, 0], rot: 0, cam: [0, 2.1, 6] },
};

// Page → robot mode used in its header.
export const PAGE_ROBOT = { about: 'globe', experience: 'type', projects: 'projector', skills: 'build', contact: 'plane' };

const FOV = 38;

// Screen position (in the robot canvas, pixels) of the planet under the robot,
// with the same camera as Robot3D's Scene: returns its centre and radius.
export function planetOnScreen(mode, w, h) {
  const L = LAYOUT[mode];
  const pos = [L.cam[0], L.cam[1] + 0.4, L.cam[2] + 0.6];
  const look = [L.cam[0] * 0.5, 1.15, 0];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = (a) => {
    const l = Math.hypot(a[0], a[1], a[2]);
    return [a[0] / l, a[1] / l, a[2] / l];
  };
  const fwd = norm(sub(look, pos));
  const right = norm(cross(fwd, [0, 1, 0]));
  const up = cross(right, fwd);
  const f = h / 2 / Math.tan(((FOV / 2) * Math.PI) / 180);
  const project = (p) => {
    const v = sub(p, pos);
    const z = dot(v, fwd);
    return { x: w / 2 + (dot(v, right) / z) * f, y: h / 2 - (dot(v, up) / z) * f, z };
  };
  const c = project([L.robot[0], -PLANET_R, 0]);
  const top = project([L.robot[0], 0, 0]);
  return { x: c.x, y: c.y, r: (PLANET_R * f) / c.z, topY: top.y };
}
