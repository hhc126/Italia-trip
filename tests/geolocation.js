/**
 * 意大利行程单 — 地理位置定位测试
 * 模拟用户在 5 座城市及边界场景，验证 Haversine 最近城市匹配逻辑
 */
const cities = [
  { id: 'city-sorrento', name: '索伦托',  lat: 40.6263, lng: 14.3758, dates: '7/11-14' },
  { id: 'city-rome',     name: '罗马',     lat: 41.9028, lng: 12.4964, dates: '7/14-18' },
  { id: 'city-florence', name: '佛罗伦萨', lat: 43.7696, lng: 11.2558, dates: '7/18-21' },
  { id: 'city-venice',   name: '威尼斯',   lat: 45.4408, lng: 12.3155, dates: '7/21-22' },
  { id: 'city-milan',    name: '米兰',     lat: 45.4642, lng:  9.1900, dates: '7/22-23' },
];

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearest(lat, lng) {
  let nearest = null, minDist = Infinity;
  for (const c of cities) {
    const d = haversine(lat, lng, c.lat, c.lng);
    if (d < minDist) { minDist = d; nearest = c; }
  }
  // 返回所有城市的距离
  const allDist = cities.map(c => ({ name: c.name, km: haversine(lat, lng, c.lat, c.lng) }));
  return { city: nearest, distance: minDist, allDist };
}

const FAR_THRESHOLD = 200;

// ========== 测试用例 ==========

const testCases = [
  // 精确城市坐标
  { label: '索伦托（市中心）',       lat: 40.6263, lng: 14.3758, expect: '索伦托' },
  { label: '罗马（市中心）',         lat: 41.9028, lng: 12.4964, expect: '罗马' },
  { label: '佛罗伦萨（市中心）',     lat: 43.7696, lng: 11.2558, expect: '佛罗伦萨' },
  { label: '威尼斯（市中心）',       lat: 45.4408, lng: 12.3155, expect: '威尼斯' },
  { label: '米兰（市中心）',         lat: 45.4642, lng:  9.1900, expect: '米兰' },

  // 酒店实际位置（偏移 1-3km）
  { label: '索伦托·乔伊酒店',       lat: 40.6364, lng: 14.4100, expect: '索伦托' },
  { label: '罗马·Ruby朱莉亚酒店',    lat: 41.8995, lng: 12.4978, expect: '罗马' },
  { label: '佛罗伦萨·赤宝石比亚',   lat: 43.7835, lng: 11.2615, expect: '佛罗伦萨' },
  { label: '威尼斯·贝斯特韦斯特',   lat: 45.4534, lng: 12.3270, expect: '威尼斯' },
  { label: '米兰·星际埃科',         lat: 45.4834, lng:  9.2050, expect: '米兰' },

  // 边界场景：两城中间
  { label: '罗马-佛罗伦萨中间（Orvieto）', lat: 42.7186, lng: 12.1113, expect: '罗马' },    // Orvieto 偏罗马
  { label: '佛罗伦萨-威尼斯中间（Bologna）', lat: 44.4949, lng: 11.3426, expect: '佛罗伦萨' }, // Bologna 偏佛罗伦萨
  { label: '威尼斯-米兰中间（Verona）', lat: 45.4384, lng: 10.9916, expect: '威尼斯' },      // Verona 偏威尼斯

  // 远距离场景（在中国）
  { label: '北京（远距离测试）',     lat: 39.9042, lng: 116.4074, expect: null, far: true },

  // 机场场景
  { label: '罗马菲乌米奇诺机场',     lat: 41.8003, lng: 12.2389, expect: '罗马' },
  { label: '米兰马尔彭萨机场',       lat: 45.6301, lng:  8.7230, expect: '米兰' },

  // 阿马尔菲海岸周边
  { label: '波西塔诺（阿马尔菲）',   lat: 40.6281, lng: 14.4847, expect: '索伦托' },
  { label: '庞贝古城',               lat: 40.7481, lng: 14.4894, expect: '索伦托' },
];

// ========== 执行测试 ==========

console.log('══════════════════════════════════════════════════════════');
console.log('  意大利行程单 · 地理位置定位测试报告');
console.log('  测试时间: ' + new Date().toISOString());
console.log('  远距离阈值: ' + FAR_THRESHOLD + ' km');
console.log('══════════════════════════════════════════════════════════\n');

let pass = 0, fail = 0;
const details = [];

for (const tc of testCases) {
  const result = findNearest(tc.lat, tc.lng);

  let status, reason;
  if (tc.far) {
    // 远距离场景：验证距离 > 200km
    status = result.distance > FAR_THRESHOLD ? 'PASS' : 'FAIL';
    reason = status === 'PASS'
      ? `距离 ${result.distance.toFixed(0)} km > ${FAR_THRESHOLD} km ✓（正确触发远距离提示）`
      : `距离 ${result.distance.toFixed(0)} km，未触发阈值`;
  } else {
    // 正常场景：验证最近城市匹配
    status = result.city.name === tc.expect ? 'PASS' : 'FAIL';
    reason = status === 'PASS'
      ? `最近城市「${result.city.name}」匹配 ✓，距离 ${result.distance.toFixed(1)} km`
      : `期望「${tc.expect}」，实际「${result.city.name}」，距离 ${result.distance.toFixed(1)} km ✗`;
  }

  if (status === 'PASS') pass++; else fail++;

  details.push({
    label: tc.label,
    lat: tc.lat, lng: tc.lng,
    expect: tc.expect || '(远距离)',
    actual: tc.far ? `最近: ${result.city.name}` : result.city.name,
    distance: result.distance.toFixed(1),
    status,
    reason,
    allDist: result.allDist
  });

  const mark = status === 'PASS' ? '✅' : '❌';
  console.log(`${mark} [${tc.label}]`);
  console.log(`   期望: ${tc.expect || '(触发远距离)'}  |  实际: ${result.city.name}  |  距离: ${result.distance.toFixed(1)} km`);
  console.log(`   ${reason}`);
  
  // 展示与其他城市的距离对比
  const dists = result.allDist.map(d => `${d.name}: ${d.km.toFixed(1)}km`).join(', ');
  console.log(`   各城距离: ${dists}\n`);
}

// ========== 总结 ==========
console.log('══════════════════════════════════════════════════════════');
console.log(`  测试结果: ${pass} 通过 / ${fail} 失败 / ${testCases.length} 总计`);
console.log(`  通过率: ${(pass / testCases.length * 100).toFixed(0)}%`);
console.log('══════════════════════════════════════════════════════════');

// 输出 JSON 供 HTML 报告使用
const report = {
  timestamp: new Date().toISOString(),
  summary: { total: testCases.length, pass, fail, rate: (pass / testCases.length * 100).toFixed(0) + '%' },
  config: { farThreshold: FAR_THRESHOLD, cities: cities.map(c => ({ name: c.name, lat: c.lat, lng: c.lng })) },
  cases: details
};

const fs = require('fs');
fs.writeFileSync('/Users/huanghuacai/Workbuddy/意大利之旅/test_report.json', JSON.stringify(report, null, 2));
console.log('\n📄 JSON 报告已保存: test_report.json');
