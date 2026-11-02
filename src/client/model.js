// 3D models on content pages: every figure[data-model] shows an STL file,
// ASCII or binary, in plain WebGL. Dragging turns the model, two fingers or,
// once the model has been clicked, the mouse wheel zoom it, the arrow keys
// and + and - do both, and a double click returns to the first view. It is
// drawn only when something changes, and the file is loaded once the figure
// comes near the screen.
const L = JSON.parse(document.body.dataset.modelLabels);

/** The triangles of an STL file as positions, three per corner, Z up as printed. */
function parse(buffer) {
  const view = new DataView(buffer);
  const count = buffer.byteLength >= 84 ? view.getUint32(80, true) : 0;
  if (84 + count * 50 === buffer.byteLength) {
    const out = new Float32Array(count * 9);
    for (let t = 0; t < count; t++) {
      for (let k = 0; k < 9; k++) out[t * 9 + k] = view.getFloat32(84 + t * 50 + 12 + k * 4, true);
    }
    return out;
  }
  const text = new TextDecoder().decode(buffer);
  return Float32Array.from([...text.matchAll(/vertex\s+(\S+)\s+(\S+)\s+(\S+)/g)].flatMap((m) => [+m[1], +m[2], +m[3]]));
}

/** Positions turned to Y up and centred, a flat normal per triangle, and the radius. */
function prepare(raw) {
  const n = raw.length / 3;
  const pos = new Float32Array(raw.length);
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < n; i++) {
    const p = [raw[i * 3], raw[i * 3 + 2], -raw[i * 3 + 1]];
    for (let k = 0; k < 3; k++) {
      pos[i * 3 + k] = p[k];
      min[k] = Math.min(min[k], p[k]);
      max[k] = Math.max(max[k], p[k]);
    }
  }
  const centre = min.map((v, k) => (v + max[k]) / 2);
  let radius = 0;
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < 3; k++) pos[i * 3 + k] -= centre[k];
    radius = Math.max(radius, Math.hypot(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]));
  }
  const normals = new Float32Array(raw.length);
  for (let t = 0; t < n / 3; t++) {
    const a = t * 9;
    const u = [pos[a + 3] - pos[a], pos[a + 4] - pos[a + 1], pos[a + 5] - pos[a + 2]];
    const v = [pos[a + 6] - pos[a], pos[a + 7] - pos[a + 1], pos[a + 8] - pos[a + 2]];
    const c = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const len = Math.hypot(...c) || 1;
    for (let corner = 0; corner < 3; corner++) for (let k = 0; k < 3; k++) normals[a + corner * 3 + k] = c[k] / len;
  }
  return { pos, normals, count: n, radius };
}

const VERTEX = `
attribute vec3 position;
attribute vec3 normal;
uniform mat4 turn;
uniform mat4 projection;
uniform float distance;
varying vec3 vNormal;
varying float vUp;
void main() {
  vec4 p = turn * vec4(position, 1.0);
  vNormal = (turn * vec4(normal, 0.0)).xyz;
  vUp = normal.y;
  gl_Position = projection * vec4(p.xy, p.z - distance, 1.0);
}`;

// light from the upper left in front of the viewer, plus a sky above the model
const FRAGMENT = `
precision mediump float;
uniform vec3 colour;
varying vec3 vNormal;
varying float vUp;
void main() {
  vec3 n = normalize(vNormal);
  if (!gl_FrontFacing) n = -n;
  float key = max(dot(n, normalize(vec3(-0.4, 0.7, 0.6))), 0.0);
  float sky = 0.55 + 0.25 * vUp;
  gl_FragColor = vec4(colour * (sky + 0.75 * key), 1.0);
}`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

/** The turn of the model as a column-major matrix: first around Y, then around X. */
function turnMatrix(yaw, pitch) {
  const [cy, sy, cp, sp] = [Math.cos(yaw), Math.sin(yaw), Math.cos(pitch), Math.sin(pitch)];
  return new Float32Array([cy, sp * sy, -cp * sy, 0, 0, cp, sp, 0, sy, -sp * cy, cp * cy, 0, 0, 0, 0, 1]);
}

function perspective(fov, aspect, near, far) {
  const f = 1 / Math.tan(fov / 2);
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, (2 * far * near) / (near - far), 0]);
}

function colourOf(fig) {
  const probe = document.createElement('span');
  probe.style.color = getComputedStyle(fig).getPropertyValue('--model-colour');
  fig.append(probe);
  const rgb = getComputedStyle(probe).color.match(/[\d.]+/g).slice(0, 3).map((v) => v / 255);
  probe.remove();
  return rgb;
}

async function show(fig) {
  const box = fig.querySelector('.model-canvas');
  const fail = () => (box.textContent = L.failed);
  let model;
  try {
    const response = await fetch(fig.dataset.model);
    if (!response.ok) throw new Error(response.status);
    model = prepare(parse(await response.arrayBuffer()));
    if (!model.count) throw new Error('empty');
  } catch {
    return fail();
  }
  const canvas = document.createElement('canvas');
  canvas.tabIndex = 0;
  canvas.setAttribute('aria-label', `${box.getAttribute('aria-label')}. ${L.hint}`);
  box.removeAttribute('role');
  box.removeAttribute('aria-label');
  box.append(canvas);
  const gl = canvas.getContext('webgl', { antialias: true, premultipliedAlpha: true });
  if (!gl) return fail();

  const program = gl.createProgram();
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(program);
  gl.useProgram(program);
  for (const [name, data] of [['position', model.pos], ['normal', model.normals]]) {
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const at = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(at);
    gl.vertexAttribPointer(at, 3, gl.FLOAT, false, 0, 0);
  }
  const u = Object.fromEntries(['turn', 'projection', 'distance', 'colour'].map((name) => [name, gl.getUniformLocation(program, name)]));
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 0);

  const START = { yaw: -0.7, pitch: 0.45, zoom: 1 };
  const state = { ...START };
  let colour = colourOf(fig);
  let pending = false;
  const draw = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      const ratio = devicePixelRatio || 1;
      const [w, h] = [Math.round(canvas.clientWidth * ratio), Math.round(canvas.clientHeight * ratio)];
      if (canvas.width !== w || canvas.height !== h) [canvas.width, canvas.height] = [w, h];
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      const distance = model.radius * 2.8 * state.zoom;
      gl.uniformMatrix4fv(u.turn, false, turnMatrix(state.yaw, state.pitch));
      gl.uniformMatrix4fv(u.projection, false, perspective(0.6, w / h || 1, distance / 10, distance * 3));
      gl.uniform1f(u.distance, distance);
      gl.uniform3fv(u.colour, colour);
      gl.drawArrays(gl.TRIANGLES, 0, model.count);
    });
  };
  const turn = (dYaw, dPitch) => {
    state.yaw += dYaw;
    state.pitch = Math.max(-1.5, Math.min(1.5, state.pitch + dPitch));
    draw();
  };
  const zoom = (factor) => {
    state.zoom = Math.max(0.35, Math.min(3, state.zoom * factor));
    draw();
  };

  // one pointer turns, two pinch
  const pointers = new Map();
  let pinch = 0;
  const spread = () => {
    const [a, b] = [...pointers.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };
  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) pinch = spread();
    canvas.focus({ preventScroll: true });
  });
  canvas.addEventListener('pointermove', (e) => {
    const last = pointers.get(e.pointerId);
    if (!last) return;
    if (pointers.size === 1) turn((e.clientX - last.x) * 0.01, (e.clientY - last.y) * 0.01);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const now = spread();
      if (pinch) zoom(pinch / now);
      pinch = now;
    }
  });
  const release = (e) => {
    pointers.delete(e.pointerId);
    pinch = 0;
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  // the wheel scrolls the page until the model has been clicked
  canvas.addEventListener('wheel', (e) => {
    if (document.activeElement !== canvas) return;
    e.preventDefault();
    zoom(Math.exp(e.deltaY * 0.001));
  }, { passive: false });
  canvas.addEventListener('dblclick', () => {
    Object.assign(state, START);
    draw();
  });
  canvas.addEventListener('keydown', (e) => {
    const step = { ArrowLeft: [-0.15, 0], ArrowRight: [0.15, 0], ArrowUp: [0, -0.15], ArrowDown: [0, 0.15] }[e.key];
    if (step) turn(...step);
    else if (e.key === '+' || e.key === '=') zoom(0.9);
    else if (e.key === '-') zoom(1.1);
    else return;
    e.preventDefault();
  });

  new ResizeObserver(draw).observe(canvas);
  // light or dark: by the button (data-theme) or by the system
  const recolour = () => {
    colour = colourOf(fig);
    draw();
  };
  new MutationObserver(recolour).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', recolour);
  fig.classList.add('is-ready');
  // how to use it, once below each row of models
  const row = fig.closest('.model-row');
  if (row && !row.nextElementSibling?.classList.contains('model-hint')) {
    const hint = document.createElement('p');
    hint.className = 'model-hint';
    hint.textContent = L.hint;
    row.after(hint);
  }
  draw();
}

const near = new IntersectionObserver(
  (entries) => {
    for (const entry of entries.filter((x) => x.isIntersecting)) {
      near.unobserve(entry.target);
      show(entry.target);
    }
  },
  { rootMargin: '300px' },
);
for (const fig of document.querySelectorAll('figure[data-model]')) near.observe(fig);
