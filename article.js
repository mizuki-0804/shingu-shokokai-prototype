/* 記事・掲載ページ 共通スクリプト（ヘッダー挙動・進捗・リビール・いいね・メニュー） */
(() => {
  "use strict";
  document.documentElement.classList.add("js");
  document.body.classList.add("is-ready");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => [...r.querySelectorAll(s)];

  /* ヘッダー: スクロールで陰影、進捗バー */
  const header = qs("#site-header");
  header?.classList.add("is-scrolled");
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    document.documentElement.style.setProperty("--scroll-progress", (y / max).toFixed(4));
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScroll);
  }, { passive: true });
  onScroll();

  /* モバイルメニュー */
  const menuToggle = qs("#menu-toggle");
  const mobileMenu = qs("#mobile-menu");
  const closeMenu = () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    mobileMenu?.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    setTimeout(() => mobileMenu?.setAttribute("hidden", ""), 400);
  };
  menuToggle?.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    if (open) {
      closeMenu();
    } else {
      mobileMenu?.removeAttribute("hidden");
      requestAnimationFrame(() => mobileMenu?.classList.add("is-open"));
      menuToggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("is-locked");
    }
  });
  qsa("a", mobileMenu || undefined).forEach((a) => a.addEventListener("click", closeMenu));

  /* いいね */
  const LIKE_KEY = "shingu-article-likes";
  const readLikes = () => {
    try { return JSON.parse(localStorage.getItem(LIKE_KEY) || "{}"); }
    catch (e) { return {}; }
  };
  const likeRecord = (likes, id, base) => {
    const cur = likes[id];
    if (typeof cur === "number") return { count: cur, liked: cur > base };
    return { count: Number(cur?.count ?? base), liked: Boolean(cur?.liked) };
  };
  qsa("[data-like-id]").forEach((button) => {
    const rec = likeRecord(readLikes(), button.dataset.likeId, Number(button.dataset.likeBase || 0));
    button.querySelector("strong").textContent = String(rec.count);
    button.classList.toggle("is-liked", rec.liked);
    button.disabled = rec.liked;
    button.setAttribute("aria-pressed", String(rec.liked));
  });
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-like-id]");
    if (!button || button.disabled) return;
    const likes = readLikes();
    const id = button.dataset.likeId;
    const rec = likeRecord(likes, id, Number(button.dataset.likeBase || 0));
    likes[id] = { count: rec.count + 1, liked: true };
    try { localStorage.setItem(LIKE_KEY, JSON.stringify(likes)); } catch (e) { /* noop */ }
    button.querySelector("strong").textContent = String(rec.count + 1);
    button.classList.add("is-liked");
    button.disabled = true;
    button.setAttribute("aria-pressed", "true");
  });

  /* スクロールリビール */
  if (!prefersReduced && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    qsa("[data-reveal]").forEach((el) => obs.observe(el));
  } else {
    qsa("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
  }
})();
