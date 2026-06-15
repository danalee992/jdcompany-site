/* =========================================================
   JDCOMPANY — 공통 스크립트
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 모바일 메뉴 토글 ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      const open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });

    // 링크 클릭 시 메뉴 닫기
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 스크롤 시 헤더 경계선 ---------- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 등장 애니메이션 ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
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
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- 현재 연도 ---------- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- 문의 폼 (Web3Forms 전송) ---------- */
  const form = document.querySelector("[data-contact-form]");
  if (form) {
    const status = form.querySelector("[data-form-status]");
    const submitBtn = form.querySelector("button[type='submit']");
    const defaultNote = status ? status.textContent : "";

    const setStatus = function (msg, color) {
      if (!status) return;
      status.textContent = msg;
      status.style.color = color || "var(--text-dim)";
    };

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      // 필수 항목 간단 검증
      const required = ["name", "contact", "message"];
      for (const fieldName of required) {
        const el = form.querySelector("[name='" + fieldName + "']");
        if (el && !el.value.trim()) {
          el.focus();
          setStatus("필수 항목을 모두 입력해 주세요.", "#f87171");
          return;
        }
      }

      // 키 미설정 시: 전송 대신 직접 연락 안내
      const keyEl = form.querySelector("[name='access_key']");
      if (!keyEl || keyEl.value.indexOf("YOUR_WEB3FORMS") !== -1) {
        setStatus(
          "온라인 접수 준비 중입니다. 031-957-3631 또는 jdco2209@gmail.com 으로 연락 주세요.",
          "#f87171"
        );
        return;
      }

      const originalLabel = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "보내는 중…"; }
      setStatus("문의를 전송하고 있습니다…", "var(--text-dim)");

      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        const data = await res.json();
        if (data.success) {
          setStatus("감사합니다. 문의가 접수되었습니다. 빠르게 연락드리겠습니다.", "var(--accent)");
          form.reset();
        } else {
          throw new Error(data.message || "전송 실패");
        }
      } catch (err) {
        setStatus(
          "전송 중 문제가 발생했습니다. 031-957-3631 또는 jdco2209@gmail.com 으로 연락 주세요.",
          "#f87171"
        );
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
      }
    });

    // 입력을 다시 시작하면 기본 안내 문구로 복원
    form.addEventListener("input", function () {
      if (status && status.textContent !== defaultNote) setStatus(defaultNote, "var(--text-dim)");
    });
  }
})();
