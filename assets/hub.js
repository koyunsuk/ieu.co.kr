/* IEU Hub 데이터룸(Firebase ieu-hub) 읽기 — 회사 사이트는 표현만 한다.
   공개(visibility == 'public') 프로젝트만 읽을 수 있으며, 실패하면 페이지에 써 둔 기본 내용을 그대로 둔다. */
window.IEUHub = (function () {
  var KEY = 'AIzaSyDmsu856i5uECq_JDlDY64ggXI4ReUXkt8';
  var URL = 'https://firestore.googleapis.com/v1/projects/ieu-hub/databases/(default)/documents:runQuery?key=' + KEY;

  function val(v) {
    if (!v) return null;
    if ('stringValue' in v) return v.stringValue;
    if ('integerValue' in v) return Number(v.integerValue);
    if ('doubleValue' in v) return v.doubleValue;
    if ('booleanValue' in v) return v.booleanValue;
    if ('timestampValue' in v) return v.timestampValue;
    if ('arrayValue' in v) return (v.arrayValue.values || []).map(val);
    if ('mapValue' in v) return fields(v.mapValue.fields || {});
    return null;
  }
  function fields(f) { var o = {}; Object.keys(f).forEach(function (k) { o[k] = val(f[k]); }); return o; }

  function eq(path, s) { return { fieldFilter: { field: { fieldPath: path }, op: 'EQUAL', value: { stringValue: s } } }; }

  /** 공개 프로젝트 목록 (표시 순서대로). extra 가 있으면 slug 등 조건을 더한다 */
  function projects(extra) {
    var filters = [eq('visibility', 'public')].concat(extra || []);
    var where = filters.length > 1 ? { compositeFilter: { op: 'AND', filters: filters } } : filters[0];
    return fetch(URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ structuredQuery: { from: [{ collectionId: 'projects' }], where: where } })
    }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (rows) {
        return rows.filter(function (r) { return r.document; }).map(function (r) {
          var o = fields(r.document.fields || {}); o.id = r.document.name.split('/').pop(); return o;
        }).sort(function (a, b) { return (a.order == null ? 99 : a.order) - (b.order == null ? 99 : b.order); });
      });
  }

  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }

  /** 카드가 이동할 주소 */
  function href(p, base) {
    if (p.link === 'url' && p.url) return p.url;
    return (base || '') + 'project.html?slug=' + encodeURIComponent(p.slug);
  }

  return { projects: projects, eq: eq, esc: esc, href: href };
})();
