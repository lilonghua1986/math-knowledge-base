// 圆锥的切面（圆锥曲线）—— 可交互 3D 演示
// 普通经典脚本（非 ES module），依赖全局 THREE / THREE.OrbitControls
// （由 index.html 里先加载的 three.min.js + OrbitControls.js 提供）。
// 对外暴露 window.initConeSection3D(container) / window.destroyConeSection3D()，
// 供 js/app.js 调用。
// 整体包一层 IIFE：经典 <script> 标签共享同一个全局作用域，避免与其它演示文件
// 的顶层 let/const 同名变量（如 renderer/scene）冲突导致 SyntaxError。
(function () {

// ---------- 几何约定 ----------
// 两个圆锥共顶点于原点，轴沿 Y 轴，半顶角 ALPHA_DEG，母线方向与轴夹角 = ALPHA_DEG。
// 圆锥面方程：x² + z² = (K * y)²，K = tan(ALPHA_DEG)，y ∈ [-H, H]（两片圆锥各自的高）。
const ALPHA_DEG = 30;
const K = Math.tan((ALPHA_DEG * Math.PI) / 180);
const H = 1;
const N_SAMPLES = 240;

// 切割平面：法向 n(β) = (sinβ, cosβ, 0)，平面方程 n·X = d。
// β = 0：平面水平（⟂轴）→ 圆；0<β<90-α：椭圆；β=90-α：抛物线（平面平行于一条母线）；β>90-α：双曲线（截两片）。
function sampleConicPoints(betaDeg, d) {
  const beta = (betaDeg * Math.PI) / 180;
  const sb = Math.sin(beta);
  const cb = Math.cos(beta);
  const pts = [];
  for (let i = 0; i < N_SAMPLES; i++) {
    const phi = (2 * Math.PI * i) / N_SAMPLES;
    const cosPhi = Math.cos(phi);
    const denom = sb * K * cosPhi + cb;
    if (Math.abs(denom) < 1e-9) {
      pts.push(null);
      continue;
    }
    const y = d / denom;
    if (y < -H - 1e-6 || y > H + 1e-6) {
      pts.push(null);
      continue;
    }
    const x = K * y * cosPhi;
    const z = K * y * Math.sin(phi);
    pts.push([x, y, z]);
  }
  return pts;
}

// 把采样点按有效性分段，返回若干条连续折线；若全部有效则视为一条闭合环。
function chainRuns(pts) {
  const n = pts.length;
  const valid = pts.map((p) => p !== null);
  if (valid.every((v) => v)) return { runs: [pts.slice()], closed: true };
  if (valid.every((v) => !v)) return { runs: [], closed: false };

  let start = 0;
  for (let i = 0; i < n; i++) {
    if (valid[i] && !valid[(i - 1 + n) % n]) {
      start = i;
      break;
    }
  }
  const runs = [];
  let cur = [];
  for (let k = 0; k < n; k++) {
    const i = (start + k) % n;
    if (valid[i]) {
      cur.push(pts[i]);
    } else if (cur.length) {
      runs.push(cur);
      cur = [];
    }
  }
  if (cur.length) runs.push(cur);
  return { runs, closed: false };
}

function classifyLabel(betaDeg, d) {
  if (Math.abs(d) < 0.02) return "退化情形：平面过顶点，截线缩成一点";
  const thresh = 90 - ALPHA_DEG;
  if (betaDeg < 0.5) return "圆";
  if (betaDeg < thresh - 0.5) return "椭圆";
  if (Math.abs(betaDeg - thresh) <= 0.5) return "抛物线";
  return "双曲线";
}

const PRESETS = {
  circle: { beta: 0, d: 0.65 },
  ellipse: { beta: 30, d: 0.45 },
  parabola: { beta: 90 - ALPHA_DEG, d: 0.5 },
  hyperbola: { beta: 80, d: 0.3 },
};
const OFFSET_SCALE = 1.3; // 偏移滑块 -100~100 映射到 d ∈ [-1.3, 1.3]

let renderer = null;
let scene = null;
let camera = null;
let controls = null;
let rafId = null;
let resizeHandler = null;
let planeMesh = null;
let curveGroup = null;
let apexMarker = null;

function disposeObject3D(obj) {
  if (!obj) return;
  if (obj.geometry) obj.geometry.dispose();
  if (obj.material) obj.material.dispose();
}

function destroyConeSection3D() {
  if (rafId !== null) cancelAnimationFrame(rafId);
  rafId = null;
  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
    resizeHandler = null;
  }
  if (controls) controls.dispose();
  if (curveGroup) {
    curveGroup.children.forEach(disposeObject3D);
  }
  if (renderer) {
    renderer.dispose();
    renderer.domElement.remove();
  }
  renderer = scene = camera = controls = planeMesh = curveGroup = apexMarker = null;
}

function buildConeNappe(sign, radialSegments) {
  // sign = +1 → 顶点在原点、沿 +Y 展开的上片；sign = -1 → 沿 -Y 展开的下片
  const geo = new THREE.ConeGeometry(K * H, H, radialSegments, 1, true);
  if (sign > 0) geo.rotateX(Math.PI);
  geo.translate(0, (sign * H) / 2, 0);
  return geo;
}

function initConeSection3D(container) {
  destroyConeSection3D();

  if (typeof THREE === "undefined" || typeof THREE.OrbitControls !== "function") {
    container.innerHTML = `<p class="demo3d-hint">3D 组件加载失败（可能是网络问题，三维库未能加载），请检查网络后刷新页面重试。</p>`;
    return;
  }

  container.innerHTML = `
    <div class="demo3d-canvas-wrap"></div>
    <div class="demo3d-controls">
      <label>平面倾斜角 β（与水平面夹角）
        <input type="range" id="k3d-beta" min="0" max="90" step="0.5" value="0">
        <span id="k3d-beta-val"></span>
      </label>
      <label>平面沿轴偏移
        <input type="range" id="k3d-offset" min="-100" max="100" step="1" value="50">
        <span id="k3d-offset-val"></span>
      </label>
      <p class="demo3d-conic-label">当前截线：<strong id="k3d-conic-label">—</strong></p>
      <div class="demo3d-presets">
        <button type="button" data-preset="circle">圆</button>
        <button type="button" data-preset="ellipse">椭圆</button>
        <button type="button" data-preset="parabola">抛物线</button>
        <button type="button" data-preset="hyperbola">双曲线</button>
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
    container.innerHTML = `<p class="demo3d-hint">当前浏览器无法启用 3D 效果（WebGL 不可用），请换一个浏览器或开启硬件加速后重试。</p>`;
    return;
  }

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf8fafc);

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(3.0, 2.0, 3.4);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  canvasWrap.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 1.8;
  controls.maxDistance = 9;
  controls.target.set(0, 0, 0);

  // 双圆锥：半透明曲面（高精度）+ 线框（低精度，母线+底圆）
  const surfaceMat = new THREE.MeshBasicMaterial({
    color: 0x94a3b8,
    transparent: true,
    opacity: 0.1,
    side: THREE.DoubleSide,
  });
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x334155 });
  [1, -1].forEach((sign) => {
    const surfGeo = buildConeNappe(sign, 64);
    scene.add(new THREE.Mesh(surfGeo, surfaceMat.clone()));
    const wireGeo = buildConeNappe(sign, 20);
    scene.add(new THREE.LineSegments(new THREE.EdgesGeometry(wireGeo), edgeMat));
    wireGeo.dispose();
  });

  planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.6, 2.6),
    new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  scene.add(planeMesh);

  curveGroup = new THREE.Group();
  scene.add(curveGroup);

  apexMarker = new THREE.Mesh(
    new THREE.SphereGeometry(0.025, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0x2563eb })
  );
  apexMarker.visible = false;
  scene.add(apexMarker);

  const betaInput = container.querySelector("#k3d-beta");
  const offsetInput = container.querySelector("#k3d-offset");
  const betaVal = container.querySelector("#k3d-beta-val");
  const offsetVal = container.querySelector("#k3d-offset-val");
  const conicLabel = container.querySelector("#k3d-conic-label");

  function updateGeometry(betaDeg, d) {
    const beta = (betaDeg * Math.PI) / 180;
    const n = new THREE.Vector3(Math.sin(beta), Math.cos(beta), 0);
    planeMesh.position.copy(n).multiplyScalar(d);
    planeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);

    curveGroup.children.forEach(disposeObject3D);
    curveGroup.clear();

    const pts = sampleConicPoints(betaDeg, d);
    const { runs, closed } = chainRuns(pts);

    apexMarker.visible = Math.abs(d) < 0.02;

    runs.forEach((run) => {
      if (run.length < 2) return;
      const verts = [];
      run.forEach((p) => verts.push(p[0], p[1], p[2]));
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
      const isFullLoop = closed && run.length === N_SAMPLES;
      const line = isFullLoop
        ? new THREE.LineLoop(geo, new THREE.LineBasicMaterial({ color: 0x2563eb }))
        : new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0x2563eb }));
      curveGroup.add(line);

      if (isFullLoop) {
        const cx = run.reduce((s, p) => s + p[0], 0) / run.length;
        const cy = run.reduce((s, p) => s + p[1], 0) / run.length;
        const cz = run.reduce((s, p) => s + p[2], 0) / run.length;
        const fillVerts = [cx, cy, cz];
        run.forEach((p) => fillVerts.push(p[0], p[1], p[2]));
        const indices = [];
        for (let i = 0; i < run.length; i++) {
          indices.push(0, 1 + i, 1 + ((i + 1) % run.length));
        }
        const fillGeo = new THREE.BufferGeometry();
        fillGeo.setAttribute("position", new THREE.Float32BufferAttribute(fillVerts, 3));
        fillGeo.setIndex(indices);
        const fillMesh = new THREE.Mesh(
          fillGeo,
          new THREE.MeshBasicMaterial({
            color: 0x2563eb,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
            depthWrite: false,
          })
        );
        curveGroup.add(fillMesh);
      }
    });

    conicLabel.textContent = classifyLabel(betaDeg, d);
  }

  function updateFromSliders() {
    const betaDeg = parseFloat(betaInput.value);
    const frac = parseFloat(offsetInput.value) / 100;
    const d = frac * OFFSET_SCALE;
    betaVal.textContent = Math.round(betaDeg) + "°";
    offsetVal.textContent = Math.round(frac * 100) + "%";
    updateGeometry(betaDeg, d);
  }

  [betaInput, offsetInput].forEach((input) => input.addEventListener("input", updateFromSliders));

  container.querySelectorAll(".demo3d-presets button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const preset = PRESETS[btn.dataset.preset];
      betaInput.value = preset.beta;
      offsetInput.value = Math.round((preset.d / OFFSET_SCALE) * 100);
      updateFromSliders();
    });
  });

  updateFromSliders();

  function animate() {
    rafId = requestAnimationFrame(animate);
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

window.initConeSection3D = initConeSection3D;
window.destroyConeSection3D = destroyConeSection3D;
window.dispatchEvent(new Event("cone3d-ready"));

})();
