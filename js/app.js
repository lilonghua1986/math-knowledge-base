// ---------- 配置 ----------
const TEXTBOOKS = ["必修1", "必修2", "选择性必修1", "选择性必修2", "选择性必修3"];
const KNOWLEDGE_CATEGORIES = ["函数", "三角函数", "不等式", "解三角形", "立体几何", "解析几何", "导数", "概率统计"];

// ---------- 状态 ----------
const state = {
  mode: "textbook",       // "textbook" | "knowledge"
  filter: null,            // 选中的课本名 或 知识点大类名
  openGroup: null,         // 展开的 topicGroup
  openSub: null            // 展开的 subTopic（显示详情）
};

const filterRowEl = document.getElementById("filterRow");
const contentEl = document.getElementById("content");

// ---------- 渲染：顶部模式切换 ----------
document.querySelectorAll(".mode-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    state.mode = btn.dataset.mode;
    state.filter = null;
    state.openGroup = null;
    state.openSub = null;
    render();
  });
});

// ---------- 渲染：课本/知识点筛选按钮 ----------
function renderFilterRow() {
  const options = state.mode === "textbook" ? TEXTBOOKS : KNOWLEDGE_CATEGORIES;
  filterRowEl.innerHTML = options.map(name => {
    const active = state.filter === name ? "active" : "";
    return `<button class="filter-btn ${active}" data-name="${name}">${name}</button>`;
  }).join("");

  filterRowEl.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.filter = btn.dataset.name;
      state.openGroup = null;
      state.openSub = null;
      render();
    });
  });

  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mode === state.mode);
  });
}

// ---------- 渲染：主内容区 ----------
function render() {
  if (window.destroyCubeSection3D) window.destroyCubeSection3D();
  if (window.destroyConeSection3D) window.destroyConeSection3D();
  renderFilterRow();

  if (!state.filter) {
    contentEl.innerHTML = `<p class="hint">请选择${state.mode === "textbook" ? "课本" : "知识点"}</p>`;
    return;
  }

  if (state.openSub) {
    renderDetail(state.openSub);
  } else {
    renderGroupList();
  }
}

// 按当前 filter 取出相关 topics
function getFilteredTopics() {
  return TOPICS_DATA.filter(t =>
    state.mode === "textbook"
      ? t.textbooks.includes(state.filter)
      : t.knowledgeCategory === state.filter
  );
}

// 第一层：按 topicGroup 分组，组内按 subTopic 列卡片
function renderGroupList() {
  const topics = getFilteredTopics();

  if (topics.length === 0) {
    contentEl.innerHTML = `<p class="hint">该分类下暂无内容，敬请期待</p>`;
    return;
  }

  const groups = {};
  topics.forEach(t => {
    if (!groups[t.topicGroup]) groups[t.topicGroup] = {};
    if (!groups[t.topicGroup][t.subTopic]) groups[t.topicGroup][t.subTopic] = [];
    groups[t.topicGroup][t.subTopic].push(t);
  });

  let html = "";
  Object.keys(groups).forEach(groupName => {
    html += `<div class="group-block"><h2 class="group-title">${groupName}</h2><div class="card-grid">`;
    Object.keys(groups[groupName]).forEach(subName => {
      const subTopics = groups[groupName][subName];
      const hasReady = subTopics.some(t => t.status === "ready");
      const badge = hasReady
        ? `<span class="badge badge-ready">已更新</span>`
        : `<span class="badge badge-placeholder">待补充</span>`;
      const summary = subTopics[0].summary || "";
      html += `
        <div class="topic-card" data-sub="${subName}">
          <h3>${subName}${badge}</h3>
          <p>${summary}</p>
        </div>`;
    });
    html += `</div></div>`;
  });

  contentEl.innerHTML = html;

  contentEl.querySelectorAll(".topic-card").forEach(card => {
    card.addEventListener("click", () => {
      state.openSub = card.dataset.sub;
      render();
    });
  });
}

// 第二层：展示某个 subTopic 下的全部条目（ready 内容 + placeholder 提示）
function renderDetail(subTopic) {
  const topics = getFilteredTopics().filter(t => t.subTopic === subTopic);

  let html = `
    <div class="breadcrumb">
      <span class="crumb-link" id="backLink">← 返回列表</span>　/　${subTopic}
    </div>`;

  topics.forEach(t => {
    html += `<div class="detail-panel">`;
    html += `<h2>${t.title}</h2>`;

    if (t.status === "placeholder") {
      html += `<p class="placeholder-note">内容待补充</p>`;
    } else {
      html += `<div class="intro">${t.contentHtml || ""}</div>`;
      if (t.interactive === "cube-section") {
        html += `<h3 class="section-subtitle">动手切一刀：拖动滑块观察截面变化</h3>`;
        html += `<div class="demo3d-panel" id="cube3d-mount"></div>`;
      }
      if (t.interactive === "cone-section") {
        html += `<h3 class="section-subtitle">动手切一刀：拖动滑块观察四种截线</h3>`;
        html += `<div class="demo3d-panel" id="cone3d-mount"></div>`;
      }
      if (t.interactive === "iframe" && t.embedSrc) {
        html += `<h3 class="section-subtitle">动手试一试</h3>`;
        html += `<div class="embed-panel"><iframe src="${t.embedSrc}" loading="lazy" title="${t.title}" style="height:${t.embedHeight || 720}px"></iframe></div>`;
      }
      if (t.diagramType === "cube" && Array.isArray(t.diagrams)) {
        html += `<h3 class="section-subtitle">几种典型截面归纳</h3>`;
        html += renderCubeDiagrams(t.diagrams);
      }
    }
    html += `</div>`;
  });

  contentEl.innerHTML = html;

  const cube3dMount = document.getElementById("cube3d-mount");
  if (cube3dMount) {
    if (window.initCubeSection3D) {
      window.initCubeSection3D(cube3dMount);
    } else {
      window.addEventListener("cube3d-ready", () => window.initCubeSection3D(cube3dMount), { once: true });
    }
  }

  const cone3dMount = document.getElementById("cone3d-mount");
  if (cone3dMount) {
    if (window.initConeSection3D) {
      window.initConeSection3D(cone3dMount);
    } else {
      window.addEventListener("cone3d-ready", () => window.initConeSection3D(cone3dMount), { once: true });
    }
  }

  document.getElementById("backLink").addEventListener("click", () => {
    state.openSub = null;
    render();
  });
}

// ---------- 正方体切面示意图（SVG） ----------
// 正方体等轴线框坐标（固定，所有切面图共用）
const CUBE_WIREFRAME = {
  center: [85, 95],      // 前顶点（可见）与后顶点（隐藏）重合于此
  top: [85, 15],
  frontRight: [154.3, 135],
  frontLeft: [15.7, 135],
  midRight: [154.3, 55],
  midLeft: [15.7, 55],
  bottom: [85, 175]
};

function renderCubeDiagrams(diagrams) {
  const cards = diagrams.map(d => `
    <div class="diagram-card">
      ${cubeDiagramSvg(d.points)}
      <h4>${d.shape}</h4>
      <p>${d.caption}</p>
    </div>`).join("");

  return `<div class="diagram-grid">${cards}</div>`;
}

function cubeDiagramSvg(points) {
  const w = CUBE_WIREFRAME;
  const pt = p => p.join(",");

  const hexagon = [w.top, w.midRight, w.frontRight, w.bottom, w.frontLeft, w.midLeft]
    .map(pt).join(" ");

  const solidSpokes = [w.midRight, w.bottom, w.midLeft]
    .map(p => `<line x1="${w.center[0]}" y1="${w.center[1]}" x2="${p[0]}" y2="${p[1]}" />`).join("");

  const dashedSpokes = [w.frontRight, w.top, w.frontLeft]
    .map(p => `<line x1="${w.center[0]}" y1="${w.center[1]}" x2="${p[0]}" y2="${p[1]}" stroke-dasharray="4 3" />`).join("");

  const cutPolygon = points.map(pt).join(" ");

  return `
    <svg viewBox="0 0 170 190" xmlns="http://www.w3.org/2000/svg">
      <polygon points="${hexagon}" fill="none" stroke="#94a3b8" stroke-width="1.3"/>
      <g stroke="#94a3b8" stroke-width="1.3">${solidSpokes}${dashedSpokes}</g>
      <polygon points="${cutPolygon}" fill="#2563eb" fill-opacity="0.28" stroke="#2563eb" stroke-width="1.8"/>
    </svg>`;
}

// ---------- 初始化 ----------
render();
