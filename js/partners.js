/* =========================================================
   JDCOMPANY — 클라이언트·협력사 로고 자동 렌더링
   data/partners.json 을 읽어 로고를 생성합니다.
   로고가 하나도 없으면 섹션 전체를 숨깁니다.
   ========================================================= */
(function () {
  "use strict";

  const section = document.querySelector("[data-partners-section]");
  const grid = document.querySelector("[data-partners-grid]");
  if (!section || !grid) return;

  const escape = function (str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  const buildLogo = function (item) {
    if (!item || !item.image) return null;

    const name = escape(item.name || "");
    const img =
      '<img src="' + escape(item.image) + '" alt="' + name +
      '" loading="lazy" onerror="this.closest(\'.logo-item\').remove()" />';

    let el;
    if (item.url) {
      el = document.createElement("a");
      el.href = item.url;
      el.target = "_blank";
      el.rel = "noopener";
    } else {
      el = document.createElement("div");
    }
    el.className = "logo-item";
    if (name) el.title = name;
    el.innerHTML = img;
    return el;
  };

  fetch("data/partners.json", { cache: "no-cache" })
    .then(function (res) {
      if (!res.ok) throw new Error("불러오기 실패");
      return res.json();
    })
    .then(function (data) {
      const items = (data && data.items) || [];
      const nodes = items.map(buildLogo).filter(Boolean);
      if (!nodes.length) return; // 로고 없음 → 섹션 숨김 유지

      nodes.forEach(function (node) { grid.appendChild(node); });
      section.removeAttribute("hidden");
    })
    .catch(function () {
      /* 실패 시 섹션은 숨김 상태 유지 */
    });
})();
