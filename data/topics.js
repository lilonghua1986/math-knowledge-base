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
    "textbooks": ["必修2"],
    "knowledgeCategory": "立体几何",
    "topicGroup": "立体几何的切面问题",
    "subTopic": "圆锥的切面",
    "status": "placeholder",
    "summary": "内容待补充。"
  }
];
