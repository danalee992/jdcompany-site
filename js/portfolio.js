/* =========================================================
   JDCOMPANY — 포트폴리오 자동 렌더링
   data/portfolio.json 을 읽어 카드를 생성합니다.
   ========================================================= */
(function () {
  "use strict";

  const grid = document.querySelector("[data-portfolio-grid]");
  const productGrid = document.querySelector("[data-products-grid]");
  if (!grid && !productGrid) return;

  const escape = function (str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  const buildCard = function (item, index) {
    const article = document.createElement("article");
    article.className = "post-card reveal";
    article.setAttribute("data-delay", String(index % 3));

    const tag = item.tag ? '<span>' + escape(item.tag) + "</span>" : "";
    const img = item.image
      ? '<img src="' + escape(item.image) + '" alt="' + escape(item.title) +
        '" loading="lazy" onerror="this.remove()" />'
      : "";

    article.innerHTML =
      '<div class="thumb">' + img + tag + "</div>" +
      '<div class="body">' +
      '<div class="meta">' + escape(item.category) + "</div>" +
      "<h3>" + escape(item.title) + "</h3>" +
      "<p>" + escape(item.description) + "</p>" +
      "</div>";

    return article;
  };

  const buildProductTile = function (item, index) {
    const fig = document.createElement("figure");
    fig.className = "product-tile reveal";
    fig.setAttribute("data-delay", String(index % 4));

    const img = item.image
      ? '<img src="' + escape(item.image) + '" alt="' + escape(item.name) +
        '" loading="lazy" onerror="this.closest(\'.product-tile\').classList.add(\'no-img\')" />'
      : "";

    fig.innerHTML =
      '<div class="product-thumb">' + img + "</div>" +
      '<figcaption>' + escape(item.name) + "</figcaption>";

    return fig;
  };

  const revealCards = function (container) {
    const cards = container.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      cards.forEach(function (el) { io.observe(el); });
    } else {
      cards.forEach(function (el) { el.classList.add("in"); });
    }
  };

  const renderGrid = function (container, url, build, emptyMsg, errorMsg) {
    fetch(url, { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error("불러오기 실패");
        return res.json();
      })
      .then(function (data) {
        const items = (data && data.items) || [];
        container.innerHTML = "";
        if (!items.length) {
          container.innerHTML =
            '<p style="grid-column:1/-1;text-align:center;color:var(--text-dim)">' + emptyMsg + "</p>";
          return;
        }
        items.forEach(function (item, i) { container.appendChild(build(item, i)); });
        revealCards(container);
      })
      .catch(function () {
        container.innerHTML =
          '<p style="grid-column:1/-1;text-align:center;color:var(--text-dim)">' + errorMsg + "</p>";
      });
  };

  if (grid) {
    renderGrid(
      grid, "data/portfolio.json", buildCard,
      "등록된 사례가 곧 업데이트됩니다.",
      "사례를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
    );
  }

  if (productGrid) {
    renderGrid(
      productGrid, "data/products.json", buildProductTile,
      "등록된 제품이 곧 업데이트됩니다.",
      "제품을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
    );
  }
})();
