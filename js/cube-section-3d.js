// 正方体切面 —— 可交互 3D 演示
// 普通经典脚本（非 ES module），依赖全局 THREE / THREE.OrbitControls
// （由 index.html 里先加载的 three.min.js + OrbitControls.js 提供），
// 这样双击打开 index.html（file:// 协议）也能正常运行。
// 对外暴露 window.initCubeSection3D(container) / window.destroyCubeSection3D()，
// 供 js/app.js 调用。
// 整体包一层 IIFE：经典 <script> 标签共享同一个全局作用域，
// 多个演示文件若都用顶层 let/const 声明同名变量（如 renderer/scene），
// 会直接抛 SyntaxError 导致后加载的脚本整体失效，所以每个演示文件都要自建作用域。
(function () {

// ---------- 几何：正方体（顶点 (±1,±1,±1)） ----------
const CUBE_VERTICES = [];
for (const x of [-1, 1]) {
  for (const y of [-1, 1]) {
    for (const z of [-1, 1]) {
      CUBE_VERTICES.push([x, y, z]);
    }
  }
}

const CUBE_EDGES = [];
for (let i = 0; i < 8; i++) {
  for (let j = i + 1; j < 8; j++) {
    let diff = 0;
    for (let k = 0; k < 3; k++) {
      if (CUBE_VERTICES[i][k] !== CUBE_VERTICES[j][k]) diff++;
    }
    if (diff === 1) CUBE_EDGES.push([i, j]);
  }
}

function dot3(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross3(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function normalize3(a) {
  const len = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / len, a[1] / len, a[2] / len];
}

// 平面：dot(n, x) = d。正方体顶点取 ±1，故沿 n 能取到的最大偏移为 |nx|+|ny|+|nz|。
function maxOffset(n) {
  return Math.abs(n[0]) + Math.abs(n[1]) + Math.abs(n[2]);
}

// 计算正方体被平面所截的截面多边形（按边界顺序返回顶点），不相交时返回 null。
function computeSectionPolygon(n, d) {
  const EPS = 1e-6;
  const raw = [];

  for (const [i, j] of CUBE_EDGES) {
    const v0 = CUBE_VERTICES[i];
    const v1 = CUBE_VERTICES[j];
    const f0 = dot3(n, v0) - d;
    const f1 = dot3(n, v1) - d;
    const s0 = Math.abs(f0) < EPS ? 0 : Math.sign(f0);
    const s1 = Math.abs(f1) < EPS ? 0 : Math.sign(f1);

    if (s0 === 0) raw.push(v0);
    if (s1 === 0) raw.push(v1);
    if (s0 !== 0 && s1 !== 0 && s0 !== s1) {
      const t = f0 / (f0 - f1);
      raw.push([
        v0[0] + t * (v1[0] - v0[0]),
        v0[1] + t * (v1[1] - v0[1]),
        v0[2] + t * (v1[2] - v0[2]),
      ]);
    }
  }

  const unique = [];
  for (const p of raw) {
    const key = p.map((c) => c.toFixed(4)).join(",");
    if (!unique.some((u) => u.key === key)) unique.push({ key, p });
  }
  const points = unique.map((u) => u.p);
  if (points.length < 3) return null;

  const cx = points.reduce((s, p) => s + p[0], 0) / points.length;
  const cy = points.reduce((s, p) => s + p[1], 0) / points.length;
  const cz = points.reduce((s, p) => s + p[2], 0) / points.length;
  const centroid = [cx, cy, cz];

  const arbitrary = Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
  const u = normalize3(cross3(n, arbitrary));
  const v = cross3(n, u);

  const withAngle = points.map((p) => {
    const rel = [p[0] - cx, p[1] - cy, p[2] - cz];
    return { p, angle: Math.atan2(dot3(rel, v), dot3(rel, u)) };
  });
  withAngle.sort((a, b) => a.angle - b.angle);

  return { points: withAngle.map((w) => w.p), centroid };
}

function sphericalToNormal(thetaDeg, phiDeg) {
  const theta = (thetaDeg * Math.PI) / 180;
  const phi = (phiDeg * Math.PI) / 180;
  return normalize3([
    Math.sin(theta) * Math.cos(phi),
    Math.sin(theta) * Math.sin(phi),
    Math.cos(theta),
  ]);
}

// 四个典型切法的滑块预设（角度已由截面算法在数学上验证）：
// - triangle：法向 (1,1,1)，偏移到接近顶点 → 切去一角的三角形
// - square：法向 (0,0,1)，过中心 → 与底面平行的正方形
// - rect：法向 (1,-1,0)，过中心 → 经过两条相对竖棱的矩形
// - hexagon：法向 (1,1,1)，过中心（体对角线中点）→ 正六边形
const PRESETS = {
  triangle: { theta: 54.7356, phi: 45, offset: 75 },
  square: { theta: 0, phi: 0, offset: 0 },
  rect: { theta: 90, phi: 315, offset: 0 },
  hexagon: { theta: 54.7356, phi: 45, offset: 0 },
};

let renderer = null;
let scene = null;
let camera = null;
let controls = null;
let rafId = null;
let resizeHandler = null;
let planeMesh = null;
let sectionMesh = null;
let sectionOutline = null;
let vertexGroup = null;
let autoPlaying = false;
let autoPlayStart = 0;

function destroyCubeSection3D() {
  if (rafId !== null) cancelAnimationFrame(rafId);
  rafId = null;
  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
    resizeHandler = null;
  }
  if (controls) controls.dispose();
  if (sectionMesh) sectionMesh.geometry.dispose();
  if (sectionOutline) sectionOutline.geometry.dispose();
  if (vertexGroup) {
    vertexGroup.children.forEach((m) => {
      m.geometry.dispose();
      m.material.dispose();
    });
  }
  if (renderer) {
    renderer.dispose();
    renderer.domElement.remove();
  }
  autoPlaying = false;
  renderer = scene = camera = controls = planeMesh = sectionMesh = sectionOutline = vertexGroup = null;
}

const SHAPE_NAMES = { 3: "三角形", 4: "四边形", 5: "五边形", 6: "六边形" };

function initCubeSection3D(container) {
  destroyCubeSection3D();

  if (typeof THREE === "undefined" || typeof THREE.OrbitControls !== "function") {
    container.innerHTML = `<p class="demo3d-hint">3D 组件加载失败（可能是网络问题，三维库未能加载），请检查网络后刷新页面重试。</p>`;
    return;
  }

  container.innerHTML = `
    <div class="demo3d-canvas-wrap"></div>
    <div class="demo3d-controls">
      <label>法向俯仰角 θ
        <input type="range" id="c3d-theta" min="0" max="180" step="0.5" value="54.7356">
        <span id="c3d-theta-val"></span>
      </label>
      <label>法向方位角 φ
        <input type="range" id="c3d-phi" min="0" max="360" step="0.5" value="45">
        <span id="c3d-phi-val"></span>
      </label>
      <label>沿法向偏移中心
        <input type="range" id="c3d-offset" min="-100" max="100" step="1" value="0">
        <span id="c3d-offset-val"></span>
      </label>
      <p class="demo3d-conic-label">当前截面：<strong id="c3d-shape-label">—</strong></p>
      <div class="demo3d-presets">
        <button type="button" data-preset="triangle">过顶点（三角形）</button>
        <button type="button" data-preset="square">平行于底面（正方形）</button>
        <button type="button" data-preset="rect">对角切割（矩形）</button>
        <button type="button" data-preset="hexagon">垂直体对角线（正六边形）</button>
        <button type="button" id="c3d-autoplay">▶ 自动演示</button>
      </div>
      <p class="demo3d-hint">拖动滑块改变切割平面；鼠标拖动旋转视角、滚轮缩放、右键拖动平移整个场景。</p>
    </div>
  `;

  const canvasWrap = container.querySelector(".demo3d-canvas-wrap");
  const width = canvasWrap.clientWidth || 400;
  const height = Math.round(width * 0.72);
  canvasWrap.style.height = height + "px";

  try {
    renderer = new THREE.WebGLRenderer({ antialias: true });
  } catch (e) {
    renderer = null;
    container.innerHTML = `<p class="demo3d-hint">当前浏览器无法启用 3D 效果（WebGL 不可用），请换一个浏览器或开启硬件加速后重试。下方仍可查看典型截面示意图。</p>`;
    return;
  }

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf8fafc);

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(3.1, 2.3, 3.6);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  canvasWrap.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 2.5;
  controls.maxDistance = 9;
  controls.target.set(0, 0, 0);

  const cubeGeo = new THREE.BoxGeometry(2, 2, 2);
  const cubeMat = new THREE.MeshBasicMaterial({
    color: 0x94a3b8,
    transparent: true,
    opacity: 0.08,
    side: THREE.DoubleSide,
  });
  scene.add(new THREE.Mesh(cubeGeo, cubeMat));
  scene.add(
    new THREE.LineSegments(
      new THREE.EdgesGeometry(cubeGeo),
      new THREE.LineBasicMaterial({ color: 0x334155 })
    )
  );

  planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3.6, 3.6),
    new THREE.MeshBasicMaterial({
      color: 0xdb2777,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  scene.add(planeMesh);

  sectionMesh = new THREE.Mesh(
    new THREE.BufferGeometry(),
    new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  scene.add(sectionMesh);

  sectionOutline = new THREE.LineLoop(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({ color: 0xf59e0b })
  );
  scene.add(sectionOutline);

  vertexGroup = new THREE.Group();
  scene.add(vertexGroup);

  const thetaInput = container.querySelector("#c3d-theta");
  const phiInput = container.querySelector("#c3d-phi");
  const offsetInput = container.querySelector("#c3d-offset");
  const thetaVal = container.querySelector("#c3d-theta-val");
  const phiVal = container.querySelector("#c3d-phi-val");
  const offsetVal = container.querySelector("#c3d-offset-val");
  const shapeLabel = container.querySelector("#c3d-shape-label");
  const autoplayBtn = container.querySelector("#c3d-autoplay");

  function updateGeometry(thetaDeg, phiDeg, frac) {
    const n = sphericalToNormal(thetaDeg, phiDeg);
    const h = maxOffset(n);
    const d = frac * h;

    const nv = new THREE.Vector3(n[0], n[1], n[2]);
    planeMesh.position.copy(nv).multiplyScalar(d);
    planeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), nv);

    const result = computeSectionPolygon(n, d);
    vertexGroup.children.forEach((m) => {
      m.geometry.dispose();
      m.material.dispose();
    });
    vertexGroup.clear();

    if (!result) {
      sectionMesh.visible = false;
      sectionOutline.visible = false;
      shapeLabel.textContent = "平面未与正方体相交";
      return;
    }
    sectionMesh.visible = true;
    sectionOutline.visible = true;

    const { points, centroid } = result;
    const fillVerts = [centroid[0], centroid[1], centroid[2]];
    points.forEach((p) => fillVerts.push(p[0], p[1], p[2]));
    const indices = [];
    for (let i = 0; i < points.length; i++) {
      indices.push(0, 1 + i, 1 + ((i + 1) % points.length));
    }

    sectionMesh.geometry.dispose();
    const fillGeo = new THREE.BufferGeometry();
    fillGeo.setAttribute("position", new THREE.Float32BufferAttribute(fillVerts, 3));
    fillGeo.setIndex(indices);
    sectionMesh.geometry = fillGeo;

    sectionOutline.geometry.dispose();
    const outlineGeo = new THREE.BufferGeometry();
    const outlineVerts = [];
    points.forEach((p) => outlineVerts.push(p[0], p[1], p[2]));
    outlineGeo.setAttribute("position", new THREE.Float32BufferAttribute(outlineVerts, 3));
    sectionOutline.geometry = outlineGeo;

    points.forEach((p) => {
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xdb2777 })
      );
      marker.position.set(p[0], p[1], p[2]);
      vertexGroup.add(marker);
    });

    shapeLabel.textContent = `${SHAPE_NAMES[points.length] || points.length + "边形"}（${points.length} 个顶点）`;
  }

  function updateFromSliders() {
    const theta = parseFloat(thetaInput.value);
    const phi = parseFloat(phiInput.value);
    const frac = parseFloat(offsetInput.value) / 100;
    thetaVal.textContent = Math.round(theta) + "°";
    phiVal.textContent = Math.round(phi) + "°";
    offsetVal.textContent = Math.round(frac * 100) + "%";
    updateGeometry(theta, phi, frac);
  }

  function stopAutoplay() {
    autoPlaying = false;
    autoplayBtn.textContent = "▶ 自动演示";
  }

  [thetaInput, phiInput, offsetInput].forEach((input) =>
    input.addEventListener("input", () => {
      stopAutoplay();
      updateFromSliders();
    })
  );

  autoplayBtn.addEventListener("click", () => {
    autoPlaying = !autoPlaying;
    autoplayBtn.textContent = autoPlaying ? "⏸ 停止演示" : "▶ 自动演示";
    if (autoPlaying) autoPlayStart = performance.now();
  });

  container.querySelectorAll(".demo3d-presets button[data-preset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      stopAutoplay();
      const preset = PRESETS[btn.dataset.preset];
      thetaInput.value = preset.theta;
      phiInput.value = preset.phi;
      offsetInput.value = preset.offset;
      updateFromSliders();
    });
  });

  updateFromSliders();

  function animate() {
    rafId = requestAnimationFrame(animate);
    if (autoPlaying) {
      const elapsed = (performance.now() - autoPlayStart) / 1000;
      const frac = Math.sin(elapsed * 0.6);
      offsetInput.value = Math.round(frac * 100);
      updateFromSliders();
    }
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  resizeHandler = () => {
    const w = canvasWrap.clientWidth;
    if (!w || !renderer) return;
    const h = Math.round(w * 0.72);
    canvasWrap.style.height = h + "px";
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener("resize", resizeHandler);
}

window.initCubeSection3D = initCubeSection3D;
window.destroyCubeSection3D = destroyCubeSection3D;
window.dispatchEvent(new Event("cube3d-ready"));

})();
