/* 新宮町商工会 地域メディア — トップページ演出・描画 */
(() => {
  "use strict";

  document.documentElement.classList.add("js");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const qs = (s, root = document) => root.querySelector(s);
  const qsa = (s, root = document) => [...root.querySelectorAll(s)];

  const data = window.SHINGU_DATA || { businesses: [], features: [], interviews: [] };
  const businesses = [...data.businesses].sort((a, b) => a.planRank - b.planRank);

  /* ============ オープニング ============ */
  const opening = qs("#opening");
  const OPENING_KEY = "shingu-opening-seen";
  let seenOpening = false;
  try {
    seenOpening = sessionStorage.getItem(OPENING_KEY) === "1";
  } catch (e) { /* プライベートブラウズ等 */ }

  const startPage = () => {
    document.body.classList.add("is-ready");
    document.body.classList.remove("is-locked");
  };

  if (prefersReduced || seenOpening || !opening) {
    opening?.classList.add("is-finished");
    startPage();
  } else {
    document.body.classList.add("is-locked");
    opening.classList.add("is-running");
    try {
      sessionStorage.setItem(OPENING_KEY, "1");
    } catch (e) { /* 保存できなくても続行 */ }

    setTimeout(() => {
      opening.classList.add("is-leaving");
      // カーテンがページを覆った瞬間にヒーローの出現を始める
      setTimeout(startPage, 550);
      setTimeout(() => opening.classList.add("is-finished"), 1100);
    }, 1300);
  }

  /* ============ ヒーロー見出しの文字分解 ============ */
  qsa("[data-split]").forEach((line) => {
    const seq = Number(line.dataset.heroSeq || 2);
    line.style.setProperty("--line-delay", `${0.25 + (seq - 2) * 0.22}s`);
    const text = line.textContent;
    line.textContent = "";
    [...text].forEach((ch, i) => {
      const span = document.createElement("span");
      span.className = "char";
      span.style.setProperty("--char-i", i);
      span.textContent = ch;
      line.append(span);
    });
  });

  /* ============ ヘッダー挙動・スクロール進捗 ============ */
  const header = qs("#site-header");
  const hero = qs(".hero");
  header?.classList.add("on-hero");
  let lastY = 0;
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    document.documentElement.style.setProperty("--scroll-progress", (y / max).toFixed(4));

    if (header) {
      header.classList.toggle("is-scrolled", y > 30);
      const heroBottom = (hero?.offsetHeight || 600) - 80;
      header.classList.toggle("on-hero", y < heroBottom);
      const goingDown = y > lastY + 4;
      const goingUp = y < lastY - 4;
      if (y > 260 && goingDown) header.classList.add("is-hidden");
      else if (goingUp || y <= 260) header.classList.remove("is-hidden");
    }

    if (!prefersReduced) {
      qsa("[data-parallax]").forEach((el) => {
        const speed = Number(el.dataset.parallax);
        const rect = el.getBoundingClientRect();
        const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
        el.style.transform = `translateY(${(offset * speed).toFixed(1)}px)`;
      });
    }

    lastY = y;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(onScroll);
    },
    { passive: true }
  );
  onScroll();

  /* ============ モバイルメニュー ============ */
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

  /* ============ ヒーロースライダー ============ */
  const slides = qsa(".hero-slide");
  const slideButtons = qsa(".hero-progress button");
  const SLIDE_MS = 6000;
  if (slides.length > 1) {
    document.documentElement.style.setProperty("--slide-ms", `${SLIDE_MS}ms`);
    let active = 0;
    let timer = null;

    const show = (index) => {
      active = (index + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle("is-active", i === active));
      slideButtons.forEach((b, i) => {
        const isActive = i === active;
        b.classList.toggle("is-active", isActive);
        b.setAttribute("aria-current", isActive ? "true" : "false");
        // メーターをリセットするため強制リフロー
        const meter = b.querySelector("i");
        if (meter) {
          meter.style.animation = "none";
          void meter.offsetWidth;
          meter.style.animation = "";
        }
      });
    };

    const play = () => {
      window.clearInterval(timer);
      if (!prefersReduced) timer = window.setInterval(() => show(active + 1), SLIDE_MS);
    };

    slideButtons.forEach((b) => {
      b.addEventListener("click", () => {
        show(Number(b.dataset.slide || 0));
        play();
      });
    });

    show(0);
    play();
  }

  /* ============ 検索ドック ============ */
  const dockForm = qs(".dock-form");
  const dockQuery = qs("#hero-query");
  const dockCategory = qs("#hero-category");
  if (dockForm && dockQuery) {
    qsa("[data-hero-category]").forEach((button) => {
      button.addEventListener("click", () => {
        if (dockCategory) dockCategory.value = button.dataset.heroCategory || "";
        qsa("[data-hero-category]").forEach((item) => {
          const isActive = item === button;
          item.classList.toggle("is-active", isActive);
          item.setAttribute("aria-selected", isActive ? "true" : "false");
        });
      });
    });

    dockForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const params = new URLSearchParams();
      if (dockQuery.value.trim()) params.set("q", dockQuery.value.trim());
      if (dockCategory?.value) params.set("category", dockCategory.value);
      window.location.href = `./businesses.html${params.toString() ? `?${params}` : ""}`;
    });
  }

  /* ============ ニュースティッカー（シームレスループ用に複製） ============ */
  const tickerTrack = qs("#newsline-track");
  if (tickerTrack && !prefersReduced) {
    const list = tickerTrack.querySelector("ul");
    if (list) {
      const clone = list.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("a").forEach((a) => a.setAttribute("tabindex", "-1"));
      list.append(...clone.children);
    }
  }

  /* ============ いいねボタン ============ */
  const LIKE_KEY = "shingu-article-likes";
  const readLikes = () => {
    try {
      return JSON.parse(localStorage.getItem(LIKE_KEY) || "{}");
    } catch (e) {
      return {};
    }
  };
  const likeRecord = (likes, id, base) => {
    const current = likes[id];
    if (typeof current === "number") return { count: current, liked: current > base };
    return { count: Number(current?.count ?? base), liked: Boolean(current?.liked) };
  };

  const likeButtonMarkup = (id, base) => {
    const record = likeRecord(readLikes(), id, base);
    return `
      <button class="like-button ${record.liked ? "is-liked" : ""}" type="button" data-like-id="${id}" data-like-base="${base}"
        aria-label="この記事にいいねする" aria-pressed="${record.liked}" ${record.liked ? "disabled" : ""}>
        <span class="like-icon" aria-hidden="true">♥</span>
        <span class="like-label">いいね</span>
        <strong>${record.count}</strong>
      </button>
    `;
  };

  const hydrateLikes = () => {
    qsa("[data-like-id]").forEach((button) => {
      const record = likeRecord(readLikes(), button.dataset.likeId, Number(button.dataset.likeBase || 0));
      button.querySelector("strong").textContent = String(record.count);
      button.classList.toggle("is-liked", record.liked);
      button.disabled = record.liked;
      button.setAttribute("aria-pressed", String(record.liked));
    });
  };

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-like-id]");
    if (!button || button.disabled) return;
    const likes = readLikes();
    const id = button.dataset.likeId;
    const record = likeRecord(likes, id, Number(button.dataset.likeBase || 0));
    likes[id] = { count: record.count + 1, liked: true };
    try {
      localStorage.setItem(LIKE_KEY, JSON.stringify(likes));
    } catch (e) { /* 保存不可でもUIは更新 */ }
    button.querySelector("strong").textContent = String(record.count + 1);
    button.classList.add("is-liked");
    button.disabled = true;
    button.setAttribute("aria-pressed", "true");
  });

  /* ============ 特集記事 ============ */
  const featureList = qs("#feature-list");
  if (featureList) {
    featureList.innerHTML = data.features
      .map(
        (feature, index) => `
        <article class="feature-card" data-reveal style="--reveal-delay:${index * 90}ms">
          <a class="card-media" href="./article-story.html"><img src="${feature.image}" alt="${feature.title}のイメージ写真" loading="lazy"></a>
          <div class="card-meta"><span>${feature.category}</span><time>${feature.date}</time></div>
          <h3><a href="./article-story.html">${feature.title}</a></h3>
          <p>${feature.excerpt}</p>
          <footer class="article-actions">
            <small>#${feature.tag}</small>
            ${likeButtonMarkup(`feature-${encodeURIComponent(`${feature.date}-${feature.title}`)}`, 12 + index * 4)}
          </footer>
        </article>
      `
      )
      .join("");
  }

  /* ============ インタビュー ============ */
  const interviewList = qs("#interview-list");
  if (interviewList) {
    interviewList.innerHTML = data.interviews
      .map((interview, index) => {
        const business = businesses.find((item) => item.id === interview.businessId);
        if (!business) return "";
        return `
          <a class="interview-card" href="./article-interview.html" data-reveal style="--reveal-delay:${index * 110}ms">
            <div class="card-media"><img src="${business.image}" alt="${business.name}のイメージ写真" loading="lazy"></div>
            <div class="card-body">
              <span>INTERVIEW ${String(index + 1).padStart(2, "0")} — ${business.category}</span>
              <h3>${interview.title}</h3>
              <blockquote>${interview.quote}</blockquote>
              <p class="card-person">${interview.person}</p>
            </div>
          </a>
        `;
      })
      .join("");
  }

  const scroller = qs("#interview-list");
  const step = () => (scroller?.querySelector(".interview-card")?.offsetWidth || 380) + 24;
  qs("#interviews-prev")?.addEventListener("click", () => scroller?.scrollBy({ left: -step(), behavior: "smooth" }));
  qs("#interviews-next")?.addEventListener("click", () => scroller?.scrollBy({ left: step(), behavior: "smooth" }));

  /* ============ 会員企業プレビュー ============ */
  const preview = qs("#business-preview-list");
  if (preview) {
    const tierClass = (rank) => (rank < 2 ? "tier-1" : rank < 3 ? "tier-2" : "");
    preview.innerHTML = businesses
      .slice(0, 4)
      .map(
        (business, index) => `
        <a class="biz-card" href="${business.id === "shingu-bakery" ? "./pr-bakery.html" : business.detailPage ? `./business-detail.html?id=${business.id}` : "./businesses.html"}" data-reveal style="--reveal-delay:${index * 90}ms">
          <div class="biz-media"><img src="${business.image}" alt="${business.name}のイメージ写真" loading="lazy"></div>
          <div class="biz-body">
            <span class="biz-plan ${tierClass(business.planRank)}">${business.plan}</span>
            <h3>${business.name}</h3>
            <p class="biz-meta">${business.category} / ${business.area}</p>
            <p class="biz-copy">${business.catchcopy}</p>
          </div>
        </a>
      `
      )
      .join("");
  }

  hydrateLikes();

  /* ============ 見出しの行リビール（まちの仕事） ============ */
  qsa("[data-split-lines]").forEach((el) => {
    const text = el.textContent;
    el.innerHTML = `<span class="line-mask"><span class="line-inner">${text}</span></span>`;
  });

  /* ============ スクロールリビール ============ */
  if (!prefersReduced && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
    qsa("[data-reveal], [data-split-lines]").forEach((el) => observer.observe(el));
  } else {
    qsa("[data-reveal], [data-split-lines]").forEach((el) => el.classList.add("is-visible"));
  }

  /* ============ カウントアップ ============ */
  const animateCount = (el) => {
    const target = Number(el.dataset.count || 0);
    if (prefersReduced) {
      el.textContent = String(target);
      return;
    }
    const duration = 1600;
    const startTime = performance.now();
    const tick = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    qsa("[data-count]").forEach((el) => countObserver.observe(el));
  } else {
    qsa("[data-count]").forEach((el) => (el.textContent = el.dataset.count));
  }
})();
