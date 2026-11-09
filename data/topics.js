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
  }
];
