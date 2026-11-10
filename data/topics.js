// 知识点数据。新增知识点时，直接在这个数组里追加一条记录即可，
// 不需要改 app.js 的渲染逻辑。
const TOPICS_DATA = [
  {
    "id": "cube-cross-section",
    "title": "正方体的切面",
    "textbooks": ["必修2"],
    "knowledgeCategory": "立体几何",
    "topicGroup": "立体几何的切面问题",
    "subTopic": "长方体的切面",
    "status": "ready",
    "interactive": "cube-section",
    "summary": "正方体被一个平面截得的截面可能是三角形、四边形、五边形，甚至六边形——关键看平面与几条棱相交。",
    "contentHtml": "<p>用一个平面去截正方体，截面的边数 = 这个平面与正方体棱（或其延长线）相交的条数。棱最多 12 条，但受正方体结构限制，截面只能是 <strong>三角形、四边形、五边形、六边形</strong> 这四类，不会出现七边形及以上。</p><p>判断技巧：先看平面与各个面的交线，再数一数交线一共经过了几条棱——交几条棱，截面就是几边形。</p>",
    "diagramType": "cube",
    "diagrams": [
      {
        "shape": "三角形",
        "caption": "平面切去一个顶点，与该顶点处的 3 条棱相交——最少边数的截面。",
        "points": [[119.65, 75], [85, 135], [50.35, 75]]
      },
      {
        "shape": "四边形（正方形）",
        "caption": "平面与底面平行（水平切一刀），交 4 条竖棱，截面是与底面全等的正方形。",
        "points": [[85, 55], [154.3, 95], [85, 135], [15.7, 95]]
      },
      {
        "shape": "四边形（矩形）",
        "caption": "平面过两条相对的竖棱（沿对角线方向竖切），交 4 条棱，截面是比侧面更大的矩形。四边形截面还可能是平行四边形、等腰梯形、菱形，关键看切法。",
        "points": [[154.3, 135], [154.3, 55], [15.7, 55], [15.7, 135]]
      },
      {
        "shape": "五边形",
        "caption": "平面斜着穿过正方体，避开两个相对的顶点，恰好与 5 条棱相交。",
        "points": [[154.3, 68.33], [119.65, 35], [50.35, 35], [15.7, 68.33], [85, 135]]
      },
      {
        "shape": "正六边形",
        "caption": "平面垂直于正方体的体对角线，且过体对角线中点，与 6 条棱的中点相交——这是最大边数的截面，也是最特殊的正六边形。",
        "points": [[154.3, 95], [119.65, 35], [50.35, 35], [15.7, 95], [50.35, 155], [119.65, 155]]
      }
    ]
  },
  {
    "id": "cuboid-cross-section-general",
    "title": "一般长方体的切面",
    "textbooks": ["必修2"],
    "knowledgeCategory": "立体几何",
    "topicGroup": "立体几何的切面问题",
    "subTopic": "长方体的切面",
    "status": "placeholder",
    "summary": "长、宽、高不相等时的切面情况，内容待补充。"
  },
  {
    "id": "sphere-cross-section",
    "title": "圆的切面",
    "textbooks": ["必修2"],
    "knowledgeCategory": "立体几何",
    "topicGroup": "立体几何的切面问题",
    "subTopic": "圆的切面",
    "status": "placeholder",
    "summary": "内容待补充。"
  },
  {
    "id": "cone-cross-section",
    "title": "圆锥的切面",
    "textbooks": ["选择性必修2"],
    "knowledgeCategory": "解析几何",
    "topicGroup": "圆锥曲线",
    "subTopic": "圆锥的切面",
    "status": "ready",
    "interactive": "cone-section",
    "summary": "用平面去切两个共顶点、开口相对的圆锥（双圆锥），随平面位置和倾斜角不同，截线依次是圆、椭圆、抛物线、双曲线——这就是“圆锥曲线”名字的来源。",
    "contentHtml": "<p>把两个圆锥顶点对顶点地拼在一起（叫<strong>双圆锥</strong>），用一个平面去截它，截线的形状只由<strong>平面与圆锥轴的夹角</strong>和圆锥本身的<strong>母线与轴的夹角（半顶角）</strong>这两个角的大小关系决定，与平面离顶点的远近无关（远近只影响截线的大小，不影响截线的类型）：</p><ul><li><strong>平面垂直于轴</strong>（夹角 90°）——截线是<strong>圆</strong>；</li><li><strong>平面倾斜，但夹角仍大于半顶角</strong>，只切到一个圆锥——截线是<strong>椭圆</strong>；</li><li><strong>平面倾斜角正好等于半顶角</strong>，也就是平面与某一条母线平行——截线是<strong>抛物线</strong>（这时截线是一条不封闭的曲线）；</li><li><strong>平面倾斜角小于半顶角</strong>，平面同时切到上下两个圆锥——截线是<strong>双曲线</strong>的两支。</li></ul><p>特别地，如果平面恰好经过公共顶点，截线会退化成一个点，或者两条相交的直线——这是以上几种曲线的\"临界\"情形。</p>"
  },
  {
    "id": "galton-board-binomial",
    "title": "高尔顿板与二项分布",
    "textbooks": ["选择性必修3"],
    "knowledgeCategory": "概率统计",
    "topicGroup": "二项分布",
    "subTopic": "高尔顿板模拟实验",
    "status": "ready",
    "interactive": "iframe",
    "embedSrc": "embeds/galton-board.html",
    "summary": "小球从高尔顿板顶端落下，每遇到一根钉子都有一半概率偏左、一半概率偏右——落入第 k 个格子的概率恰好是二项分布 B(10, 0.5) 中取到 k 次“偏右”的概率。",
    "contentHtml": "<p>高尔顿板由多排钉子交错排列而成。小球从正上方落下，每经过一排钉子，都会随机地偏向左边或右边，概率各占一半，这个过程重复 <strong>n</strong> 排。如果把“偏右”记为 1、“偏左”记为 0，小球最终落入的格子编号 <strong>k</strong> 就等于它一路上“偏右”的次数——这正是 <strong>n 次独立重复试验中成功 k 次</strong> 的过程，服从二项分布：</p><p style=\"text-align:center\"><em>P(X=k) = C(n,k) · p<sup>k</sup> · (1-p)<sup>n-k</sup></em></p><p>当 p = 0.5、n = 10 时，落点最集中在中间几格（期望 E(X) = np = 5），两侧格子命中的概率依次递减，大量小球堆积后呈现出的形状会越来越接近正态分布的钟形曲线——这也是“二项分布在 n 较大时近似正态分布”的直观来源。</p>"
  },
  {
    "id": "power-function-graph",
    "title": "幂函数的图象与性质",
    "textbooks": ["必修1"],
    "knowledgeCategory": "函数",
    "topicGroup": "幂函数",
    "subTopic": "幂函数的图象与性质",
    "status": "ready",
    "interactive": "iframe",
    "embedSrc": "embeds/power-function-graph.html",
    "embedHeight": 800,
    "summary": "幂函数 y = x^α 的图象形状由指数 α 的正负、奇偶、与 1 的大小关系共同决定——拖动 α 或勾选不同函数叠加对比，能直观看出单调性、奇偶性、凹凸性的变化规律。",
    "contentHtml": "<p>幂函数 <strong>y = x<sup>α</sup></strong>（α 为常数）是形式最简单却最容易混淆的一类函数。判断它的图象走向，关键看 α 本身的特征：</p><ul><li><strong>α &gt; 1</strong>：过原点，在第一象限内先缓后急上升（如 y=x²）；</li><li><strong>0 &lt; α &lt; 1</strong>：过原点，先急后缓上升（如 y=√x）；</li><li><strong>α &lt; 0</strong>：图象分布在第一、三象限（α 为奇数时）或第一、二象限（α 为偶数时），不过原点，以坐标轴为渐近线（如 y=1/x）；</li><li><strong>α 为奇数</strong>：函数是奇函数，图象关于原点对称；<strong>α 为偶数</strong>：函数是偶函数，图象关于 y 轴对称。</li></ul><p>定义域是否包含 0 和负数，也要结合 α 是否为整数、是否为分数来单独判断。</p>"
  },
  {
    "id": "trig-definition",
    "title": "三角函数的定义（单位圆）",
    "textbooks": ["必修1"],
    "knowledgeCategory": "三角函数",
    "topicGroup": "三角函数的定义",
    "subTopic": "单位圆定义",
    "status": "ready",
    "interactive": "iframe",
    "embedSrc": "embeds/trig-definition.html",
    "embedHeight": 1600,
    "summary": "把角的顶点放在单位圆圆心，角的终边与圆的交点坐标 (x, y) 直接给出了这个角的正弦、余弦、正切——拖动角度观察三个函数值如何随终边位置同步变化。",
    "contentHtml": "<p>设角 α 的顶点在原点，始边在 x 轴正半轴，终边与<strong>单位圆</strong>（半径为 1 的圆）交于点 P(x, y)，则：</p><ul><li><strong>sin α = y</strong>（终边交点的纵坐标）；</li><li><strong>cos α = x</strong>（终边交点的横坐标）；</li><li><strong>tan α = y / x</strong>（x ≠ 0 时，等于终边的斜率）。</li></ul><p>这个定义把三角函数从\"直角三角形里的边长比\"推广到了<strong>任意角</strong>（包括负角、大于 360° 的角），也让三个函数值的正负、周期性都能直接从终边所在的象限和圆上位置读出来。</p>"
  },
  {
    "id": "trig-graph-transform",
    "title": "三角函数图象的变换",
    "textbooks": ["必修1"],
    "knowledgeCategory": "三角函数",
    "topicGroup": "三角函数图象与性质",
    "subTopic": "图象变换（平移/伸缩）",
    "status": "ready",
    "interactive": "iframe",
    "embedSrc": "embeds/trig-graph-transform.html",
    "embedHeight": 760,
    "summary": "从 y = sin x 得到 y = A·sin(ωx + φ) 的图象，本质上是振幅、周期、相位三个独立的伸缩/平移操作——拖动 A、ω、φ 任意一个滑块，观察图象具体发生了什么变化。",
    "contentHtml": "<p>函数 <strong>y = A·sin(ωx + φ)</strong>（A &gt; 0, ω &gt; 0）的图象可以看作 y = sin x 经过三步变换得到：</p><ul><li><strong>振幅变换</strong>：纵向伸缩为原来的 A 倍，决定图象的最高点/最低点（最大值 A，最小值 -A）；</li><li><strong>周期变换</strong>：横向压缩为原来的 1/ω，周期变为 T = 2π/ω；</li><li><strong>相位变换</strong>：整体左右平移 φ/ω 个单位（φ &gt; 0 时图象向左移，φ &lt; 0 时向右移）。</li></ul><p>三个变换互相独立，可以按任意顺序叠加——拖动滑块时留意：改变 φ 只会让曲线左右挪动，不会改变形状；改变 ω 才会让曲线\"变胖变瘦\"。</p>"
  },
  {
    "id": "ellipse-definition",
    "title": "椭圆的定义",
    "textbooks": ["选择性必修1"],
    "knowledgeCategory": "解析几何",
    "topicGroup": "椭圆",
    "subTopic": "椭圆的定义",
    "status": "ready",
    "interactive": "iframe",
    "embedSrc": "embeds/ellipse-definition.html",
    "summary": "平面内到两个定点（焦点）的距离之和等于常数（大于两焦点间距离）的点的轨迹，就是椭圆——拖动动点观察这个“和不变”的性质。",
    "contentHtml": "<p>设两个定点 F₁、F₂（焦点）间的距离为 2c，动点 P 满足：</p><p style=\"text-align:center\"><em>|PF₁| + |PF₂| = 2a</em>　（2a &gt; 2c &gt; 0）</p><p>则点 P 的轨迹是<strong>椭圆</strong>，a、b、c 满足 <strong>a² = b² + c²</strong>。拖动点 P 在椭圆上移动，可以直观看到它到两个焦点的距离一个变长、另一个变短，但<strong>和始终不变</strong>。</p><p>特别地，若 2a = 2c，轨迹退化为连接两焦点的一条线段；若 2a &lt; 2c，则不存在满足条件的点（三角形两边之和大于第三边）。</p>"
  },
  {
    "id": "dihedral-angle",
    "title": "二面角的计算（法向量法）",
    "textbooks": ["选择性必修1"],
    "knowledgeCategory": "立体几何",
    "topicGroup": "空间向量与立体几何",
    "subTopic": "二面角的计算（法向量法）",
    "status": "ready",
    "interactive": "iframe",
    "embedSrc": "embeds/dihedral-angle.html",
    "embedHeight": 820,
    "summary": "求两个平面所成的二面角，不必在图上找垂线作出平面角，只需分别求出两个平面的法向量，用法向量的夹角（或其补角）直接算出来。",
    "contentHtml": "<p>设平面 α 的法向量为 <strong>n₁</strong>，平面 β 的法向量为 <strong>n₂</strong>，则：</p><p style=\"text-align:center\"><em>cos⟨n₁, n₂⟩ = (n₁·n₂) / (|n₁||n₂|)</em></p><p>这个夹角与二面角本身<strong>相等或互补</strong>，具体取哪个要结合图形（法向量的指向）判断——通常先观察二面角是锐角还是钝角，再决定是否对算出的角取补角。</p><p>这种方法把\"找平面角\"的几何构造问题，转化成了纯粹的向量坐标运算，思路固定、不易出错，是立体几何中计算二面角的首选方法。</p>"
  },
  {
    "id": "binomial-vs-hypergeometric",
    "title": "二项分布与超几何分布的对比",
    "textbooks": ["选择性必修3"],
    "knowledgeCategory": "概率统计",
    "topicGroup": "二项分布与超几何分布",
    "subTopic": "两种分布的对比",
    "status": "ready",
    "interactive": "iframe",
    "embedSrc": "embeds/binomial-vs-hypergeometric.html",
    "embedHeight": 950,
    "summary": "从 N 件产品（M 件次品）中抽 n 件，\"放回抽样\"服从二项分布、\"不放回抽样\"服从超几何分布——当 N 远大于 n 时，两者的概率分布会越来越接近。",
    "contentHtml": "<ul><li><strong>二项分布 B(n, p)</strong>：每次抽取后放回，各次试验相互独立，\"成功概率\" p 始终不变；</li><li><strong>超几何分布 H(N, M, n)</strong>：抽取后不放回，每次剩余总数和次品数都在变化，各次试验<strong>不独立</strong>。</li></ul><p>两者的区别本质上是\"抽样方式是否改变总体构成\"。当总体数量 N 很大、抽取数量 n 相对很小时，不放回对总体构成的影响微乎其微，超几何分布会越来越逼近二项分布 B(n, M/N)——拖动滑块比较 N 增大时两条分布曲线如何逐渐重合。</p>"
  },
  {
    "id": "hyperbola-definition",
    "title": "双曲线的定义",
    "textbooks": ["选择性必修1"],
    "knowledgeCategory": "解析几何",
    "topicGroup": "双曲线",
    "subTopic": "双曲线的定义",
    "status": "ready",
    "interactive": "iframe",
    "embedSrc": "embeds/hyperbola-definition.html",
    "embedHeight": 950,
    "summary": "平面内到两个定点（焦点）的距离之差的绝对值等于常数（小于两焦点间距离）的点的轨迹，就是双曲线——拖动动点观察这个\"距离差不变\"的性质。",
    "contentHtml": "<p>设两个定点 F₁、F₂（焦点）间的距离为 2c，动点 P 满足：</p><p style=\"text-align:center\"><em>| |PF₁| - |PF₂| | = 2a</em>　（0 &lt; 2a &lt; 2c）</p><p>则点 P 的轨迹是<strong>双曲线</strong>，a、b、c 满足 <strong>c² = a² + b²</strong>。这个定义里的\"差的绝对值\"很关键——它说明双曲线由两支组成：距 F₁ 更近的一支和距 F₂ 更近的一支，分别对应 |PF₁|-|PF₂| 取正或取负的情形。</p><p>特别地，若 2a = 2c，轨迹退化为一条射线；若 2a &gt; 2c，则不存在满足条件的点（三角形两边之差小于第三边）。</p>"
  },
  {
    "id": "basic-inequality",
    "title": "基本不等式的几何意义",
    "textbooks": ["必修1"],
    "knowledgeCategory": "不等式",
    "topicGroup": "基本不等式",
    "subTopic": "基本不等式的几何意义",
    "status": "ready",
    "interactive": "iframe",
    "embedSrc": "embeds/basic-inequality.html",
    "embedHeight": 950,
    "summary": "对任意 a, b ≥ 0，算术平均数 (a+b)/2 总不小于几何平均数 √(ab)——把 a、b 看作直角三角形的两条边或半圆的弦长，这个不等式就有了直观的几何图像。",
    "contentHtml": "<p>基本不等式：对任意 a, b ≥ 0，</p><p style=\"text-align:center\"><em>(a + b) / 2 ≥ √(ab)</em></p><p>当且仅当 <strong>a = b</strong> 时等号成立。几何意义常用半圆来呈现：以 a+b 为直径作半圆，半径 (a+b)/2 就是算术平均数；若弦长对应 √(ab)，垂直于直径的弦（或切线段）长度就是几何平均数——半径（斜边的一部分）总不小于这条垂线段，直观地给出了不等式成立的原因。</p><p>基本不等式是求最值问题的常用工具：和一定时积有最大值，积一定时和有最小值，但必须验证\"等号能否取到\"（即 a 能否等于 b）。</p>"
  },
  {
    "id": "derivative-geometric-meaning",
    "title": "导数的几何意义",
    "textbooks": ["选择性必修2"],
    "knowledgeCategory": "导数",
    "topicGroup": "导数的几何意义",
    "subTopic": "割线逼近切线",
    "status": "ready",
    "interactive": "iframe",
    "embedSrc": "embeds/derivative-geometric-meaning.html",
    "embedHeight": 800,
    "summary": "函数图象上一点处的切线斜率，就是这一点的导数值——把这一点与旁边一点连成割线，让旁边那点不断靠近，割线会越转越贴近切线。",
    "contentHtml": "<p>设函数 y = f(x) 在点 x₀ 附近有定义，取邻近点 x₀ + Δx，则过两点的<strong>割线斜率</strong>为：</p><p style=\"text-align:center\"><em>k = [f(x₀ + Δx) - f(x₀)] / Δx</em></p><p>当 Δx → 0 时，这个割线斜率的极限就是函数在 x₀ 处的<strong>导数 f'(x₀)</strong>，也正是曲线在该点处<strong>切线的斜率</strong>——这就是导数的几何意义。拖动滑块让 Δx 不断变小，可以直观看到割线逐渐“旋转贴合”到切线的位置。</p>"
  },
  {
    "id": "parabola-definition",
    "title": "抛物线的定义",
    "textbooks": ["选择性必修1"],
    "knowledgeCategory": "解析几何",
    "topicGroup": "抛物线",
    "subTopic": "抛物线的定义",
    "status": "ready",
    "interactive": "iframe",
    "embedSrc": "embeds/parabola-definition.html",
    "embedHeight": 950,
    "summary": "平面内到一个定点（焦点）的距离，与到一条定直线（准线，不经过该点）的距离相等的点的轨迹，就是抛物线。",
    "contentHtml": "<p>设定点 F（焦点）到定直线 l（准线）的距离为 p，动点 M 满足：</p><p style=\"text-align:center\"><em>|MF| = 到准线 l 的距离</em></p><p>则点 M 的轨迹是<strong>抛物线</strong>，标准方程为 <strong>y² = 2px</strong>（焦点在 x 轴正半轴，p &gt; 0）。这个定义把\"到点的距离\"和\"到线的距离\"统一了起来——拖动点 M，始终能看到它到焦点的线段长度与它到准线的垂线段长度保持相等。</p><p>准线到顶点的距离、顶点到焦点的距离都等于 p/2，这也是抛物线\"开口大小\"由 p 决定的原因。</p>"
  },
  {
    "id": "frustum-circumsphere",
    "title": "棱台的外接球",
    "textbooks": ["选择性必修1"],
    "knowledgeCategory": "立体几何",
    "topicGroup": "多面体与外接球",
    "subTopic": "棱台的外接球",
    "status": "ready",
    "interactive": "iframe",
    "embedSrc": "embeds/frustum-circumsphere.html",
    "embedHeight": 850,
    "summary": "正棱台的外接球球心必在上下底面中心所在的轴线上，利用球心到上、下底面顶点的距离相等（都等于半径 R）列方程，就能求出球心位置和半径。",
    "contentHtml": "<p>正棱台上下底面都是正多边形，且上下底面中心的连线垂直于两底面——外接球的球心 O 一定落在这条<strong>轴线</strong>上。设球心到下底面的距离为 d，下底面外接圆半径为 r₁，上底面外接圆半径为 r₂，上下底面间距为 h，则球心满足：</p><p style=\"text-align:center\"><em>R² = d² + r₁² = (h - d)² + r₂²</em></p><p>由这两个方程消去 R 即可解出 d，再代回求出半径 R。拖动视角观察球心、轴线与上下底面外接圆之间的位置关系，能更直观理解这组方程是怎么来的。</p>"
  },
  {
    "id": "triangle-ssa-solutions",
    "title": "解三角形中解的个数（SSA）",
    "textbooks": ["必修2"],
    "knowledgeCategory": "解三角形",
    "topicGroup": "解三角形",
    "subTopic": "SSA 解的个数判定",
    "status": "ready",
    "interactive": "iframe",
    "embedSrc": "embeds/triangle-ssa-solutions.html",
    "embedHeight": 950,
    "summary": "已知两边和其中一边的对角（边边角，SSA），三角形可能有 0 个、1 个或 2 个解——关键看已知角是锐角还是钝角，以及已知边与\"临界高度\"的大小关系。",
    "contentHtml": "<p>已知 a、b 和角 A（A 为边 a 的对角），用正弦定理 sin B = b·sin A / a 判断解的个数。记 b 到 A 所在边的高为 h = b·sin A：</p><ul><li><strong>A 为钝角或直角</strong>：只有当 a &gt; b 时有 <strong>1 解</strong>，否则<strong>无解</strong>；</li><li><strong>A 为锐角，a &lt; h</strong>：<strong>无解</strong>（a 太短，够不到对边）；</li><li><strong>A 为锐角，a = h</strong>：<strong>1 解</strong>（唯一的直角三角形）；</li><li><strong>A 为锐角，h &lt; a &lt; b</strong>：<strong>2 解</strong>（a 像圆弧一样能摆出两个不同的三角形）；</li><li><strong>A 为锐角，a ≥ b</strong>：<strong>1 解</strong>。</li></ul><p>拖动滑块改变 a、b、A 的取值，观察以 b 的端点为圆心、a 为半径的圆弧与对边方向线有 0、1 还是 2 个交点，就是解的个数的几何来源。</p>"
  }
];
