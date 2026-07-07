const businesses = [...window.SHINGU_DATA.businesses].sort((a, b) => a.planRank - b.planRank);
const features = window.SHINGU_DATA.features;
const latestArticles = window.SHINGU_DATA.latestArticles;
const interviews = window.SHINGU_DATA.interviews;
const series = window.SHINGU_DATA.series;
const adSlots = window.SHINGU_DATA.adSlots;
const likeIconSvg = `
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M7 10v11H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3Zm2 11V9.4l4.2-6.1c.3-.5.9-.7 1.5-.5 1.1.3 1.7 1.4 1.5 2.5L15.6 9H20a2 2 0 0 1 2 2.3l-1.1 7A3.2 3.2 0 0 1 17.7 21H9Z" />
  </svg>
`;

const state = {
  category: "",
  area: "",
  keyword: ""
};

let revealObserver = null;
const likeStorageKey = "shingu-article-likes";

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return [...document.querySelectorAll(selector)];
}

function articleLikeId(prefix, article) {
  return `${prefix}-${encodeURIComponent(`${article.date}-${article.title}`)}`;
}

function readLikes() {
  try {
    return JSON.parse(localStorage.getItem(likeStorageKey) || "{}");
  } catch (error) {
    return {};
  }
}

function likeRecord(likes, id, baseCount) {
  const current = likes[id];
  if (typeof current === "number") {
    return { count: current, liked: current > baseCount };
  }
  return {
    count: Number(current?.count ?? baseCount),
    liked: Boolean(current?.liked)
  };
}

function writeLikes(likes) {
  try {
    localStorage.setItem(likeStorageKey, JSON.stringify(likes));
  } catch (error) {
    // File previews and private browsing can block storage; the button still updates for the current click.
  }
}

function likeButton(id, baseCount = 0) {
  const likes = readLikes();
  const record = likeRecord(likes, id, baseCount);
  return `
    <button class="like-button ${record.liked ? "is-liked" : ""}" type="button" data-like-id="${id}" data-like-base="${baseCount}" aria-label="この記事にいいねする" aria-pressed="${record.liked ? "true" : "false"}" ${record.liked ? "disabled" : ""}>
      <span class="like-icon" aria-hidden="true">${likeIconSvg}</span>
      <span class="like-label" aria-hidden="true">いいね！</span>
      <strong>${record.count}</strong>
    </button>
  `;
}

function mapUrl(business) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`;
}

function isCallablePhone(phone) {
  return /^[0-9-]+$/.test(phone);
}

function phoneMarkup(phone) {
  return isCallablePhone(phone) ? `<a href="tel:${phone}">${phone}</a>` : phone;
}

function externalLinks(business, compact = false) {
  const links = [
    business.website
      ? `<a href="${business.website}" target="_blank" rel="noreferrer">公式サイト</a>`
      : "",
    `<a href="${mapUrl(business)}" target="_blank" rel="noreferrer">Googleマップ</a>`,
    business.instagram
      ? `<a href="${business.instagram}" target="_blank" rel="noreferrer">Instagram</a>`
      : "",
    compact || !isCallablePhone(business.phone) ? "" : `<a href="tel:${business.phone}">電話</a>`
  ];
  return links.filter(Boolean).join("");
}

function uniqueValues(key) {
  return [...new Set(businesses.map((business) => business[key]))].sort();
}

function fillSelect(select, values) {
  if (!select) return;
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
}

function matchesKeyword(business, keyword) {
  if (!keyword) return true;
  const target = [
    business.name,
    business.category,
    business.area,
    business.catchcopy,
    business.description,
    business.address,
    business.phone,
    business.plan,
    ...business.tags
  ].join(" ");
  return target.toLowerCase().includes(keyword.toLowerCase());
}

function filteredBusinesses() {
  return businesses.filter((business) => {
    const categoryOk = !state.category || business.category === state.category;
    const areaOk = !state.area || business.area === state.area;
    return categoryOk && areaOk && matchesKeyword(business, state.keyword);
  });
}

function businessCard(business, options = {}) {
  const detailLink = business.detailPage
    ? `<a class="card-detail-link" href="./business-detail.html?id=${business.id}">詳しく見る</a>`
    : `<span class="card-note">基本情報のみ掲載</span>`;

  return `
    <article class="business-card ${business.detailPage ? "premium" : ""}">
      <img src="${business.image}" alt="${business.name}のイメージ写真" loading="lazy">
      <div class="business-card-body">
        <span class="plan-badge">${business.plan}</span>
        <h3>${business.name}</h3>
        <p class="business-meta">${business.category} / ${business.area}</p>
        <p>${business.catchcopy}</p>
        ${options.compact ? "" : `
          <dl class="card-info">
            <div><dt>所在地</dt><dd>${business.address}</dd></div>
            <div><dt>電話</dt><dd>${phoneMarkup(business.phone)}</dd></div>
          </dl>
        `}
        <div class="card-links">
          ${externalLinks(business, options.compact)}
          ${detailLink}
        </div>
      </div>
    </article>
  `;
}

function adCard(slot, options = {}) {
  const business = businesses.find((item) => item.id === slot.businessId);
  if (!business) return "";
  return `
    <article class="ad-card ${options.wide ? "wide" : ""}">
      <img src="${business.image}" alt="${business.name}のイメージ写真" loading="lazy">
      <div>
        <span class="ad-label">${slot.publicLabel}</span>
        <small>${slot.publicPlacement}</small>
        <h3>${business.name}</h3>
        <p>${slot.publicDescription}</p>
        <p class="business-meta">${business.category} / ${business.area}</p>
        <div class="card-links">
          ${externalLinks(business, true)}
          ${business.detailPage ? `<a class="card-detail-link" href="./business-detail.html?id=${business.id}">詳しく見る</a>` : ""}
        </div>
      </div>
    </article>
  `;
}

function renderAdSlots() {
  const topAd = qs("#top-ad-slot");
  if (topAd) {
    topAd.innerHTML = adCard(adSlots.find((slot) => slot.id === "top-pickup"), { wide: true });
  }

  const adGrid = qs("#ad-slot-grid");
  if (adGrid) {
    adGrid.innerHTML = adSlots.map((slot) => adCard(slot)).join("");
  }

  const directoryAd = qs("#directory-ad-slot");
  if (directoryAd) {
    directoryAd.innerHTML = adCard(adSlots.find((slot) => slot.id === "directory-pr"), { wide: true });
  }
}

function renderFeatureList() {
  const featureList = qs("#feature-list");
  if (!featureList) return;
  featureList.innerHTML = features
    .map(
      (feature, index) => `
      <article class="feature-card ${index === 0 ? "large" : ""}">
        <div class="card-media"><img src="${feature.image}" alt="${feature.title}のイメージ写真" loading="lazy"></div>
        <div>
          <span>${feature.category}</span>
          <time>${feature.date}</time>
          <h3>${feature.title}</h3>
          <p>${feature.excerpt}</p>
          <footer class="article-actions">
            <small>#${feature.tag}</small>
            ${likeButton(articleLikeId("feature", feature), 12 + index * 4)}
          </footer>
        </div>
      </article>
    `
    )
    .join("");
}

function articleCard(article) {
  const id = articleLikeId("latest", article);
  return `
    <article class="article-card">
      <div class="card-media"><img src="${article.image}" alt="${article.title}のイメージ写真" loading="lazy"></div>
      <div>
        <span>${article.category}</span>
        <time>${article.date}</time>
        <h3>${article.title}</h3>
        <p>${article.excerpt}</p>
        <footer class="article-actions">
          <small>${article.author}</small>
          ${likeButton(id, 8)}
        </footer>
      </div>
    </article>
  `;
}

function renderLatestArticles() {
  const latestList = qs("#latest-list");
  if (!latestList) return;
  latestList.innerHTML = latestArticles.map((article) => articleCard(article)).join("");
}

function renderInterviews() {
  const interviewList = qs("#interview-list");
  if (!interviewList) return;
  interviewList.innerHTML = interviews
    .map((interview) => {
      const business = businesses.find((item) => item.id === interview.businessId);
      return `
        <article class="interview-card">
          <img src="${business.image}" alt="${business.name}のイメージ写真" loading="lazy">
          <div>
            <span>${business.category}</span>
            <h3>${interview.title}</h3>
            <p>${interview.quote}</p>
            <strong>${interview.person}</strong>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderSeries() {
  const seriesList = qs("#series-list");
  if (!seriesList) return;
  seriesList.innerHTML = series
    .map(
      (item) => `
      <article class="series-card">
        <img src="${item.image}" alt="${item.title}のイメージ写真" loading="lazy">
        <div>
          <span>${item.subtitle}</span>
          <h3>${item.title}</h3>
          <small>WRITTEN BY ${item.author}</small>
          <ol>
            ${item.items.map((entry) => `<li>${entry}</li>`).join("")}
          </ol>
        </div>
      </article>
    `
    )
    .join("");
}

function renderRanking() {
  const rankingList = qs("#ranking-list");
  if (!rankingList) return;
  const rankingItems = [...latestArticles.slice(0, 4), ...features.slice(0, 2)];
  rankingList.innerHTML = rankingItems
    .map(
      (item, index) => `
      <li>
        <span>${index + 1}</span>
        <div>
          <strong>${item.title}</strong>
          <small>${item.date || "2026.07"} / ${item.category}</small>
        </div>
      </li>
    `
    )
    .join("");
}

function renderBusinessPreview() {
  const preview = qs("#business-preview-list");
  if (!preview) return;
  preview.innerHTML = businesses.slice(0, 4).map((business) => businessCard(business, { compact: true })).join("");
}

function renderBusinessList() {
  const list = qs("#business-list");
  const resultCount = qs("#result-count");
  if (!list) return;

  const results = filteredBusinesses();
  if (resultCount) resultCount.textContent = `${results.length}件`;

  list.innerHTML =
    results.length > 0
      ? results.map((business) => businessCard(business)).join("")
      : `<p class="empty">条件に合う事業者が見つかりませんでした。</p>`;

  prepareMotionItems(list);
}

function setupFilters() {
  const categoryFilter = qs("#category-filter");
  const areaFilter = qs("#area-filter");
  const keywordFilter = qs("#keyword-filter");
  const reset = qs("#reset-filters");
  const shortcutButtons = qsa("[data-filter-category]");

  fillSelect(categoryFilter, uniqueValues("category"));
  fillSelect(areaFilter, uniqueValues("area"));

  const syncShortcutState = () => {
    shortcutButtons.forEach((button) => {
      const isActive = button.dataset.filterCategory === state.category;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  };

  categoryFilter?.addEventListener("change", (event) => {
    state.category = event.target.value;
    syncShortcutState();
    renderBusinessList();
  });

  areaFilter?.addEventListener("change", (event) => {
    state.area = event.target.value;
    renderBusinessList();
  });

  keywordFilter?.addEventListener("input", (event) => {
    state.keyword = event.target.value.trim();
    renderBusinessList();
  });

  shortcutButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.category = button.dataset.filterCategory || "";
      if (categoryFilter) categoryFilter.value = state.category;
      syncShortcutState();
      renderBusinessList();
    });
  });

  reset?.addEventListener("click", () => {
    state.category = "";
    state.area = "";
    state.keyword = "";
    if (categoryFilter) categoryFilter.value = "";
    if (areaFilter) areaFilter.value = "";
    if (keywordFilter) keywordFilter.value = "";
    syncShortcutState();
    renderBusinessList();
  });

  syncShortcutState();
}

function setupHeroSearch() {
  const heroForm = qs(".tsukigi-search");
  const heroQuery = qs("#hero-query");
  const heroCategory = qs("#hero-category");
  const heroButton = qs("#hero-search-button");
  if (!heroQuery || !heroButton || !heroForm) return;

  qsa("[data-hero-category]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.heroCategory || "";
      if (heroCategory) heroCategory.value = value;
      qsa("[data-hero-category]").forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", isActive ? "true" : "false");
      });
    });
  });

  const goToList = () => {
    const params = new URLSearchParams();
    if (heroQuery.value.trim()) params.set("q", heroQuery.value.trim());
    if (heroCategory?.value) params.set("category", heroCategory.value);
    window.location.href = `./businesses.html${params.toString() ? `?${params}` : ""}`;
  };

  heroForm.addEventListener("submit", (event) => {
    event.preventDefault();
    goToList();
  });

  heroButton.addEventListener("click", (event) => {
    event.preventDefault();
    goToList();
  });

  heroQuery.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      goToList();
    }
  });

  qsa(".quick-tags button").forEach((button) => {
    button.addEventListener("click", () => {
      heroQuery.value = button.dataset.tag;
      goToList();
    });
  });
}

function setupHeroSlider() {
  const hero = qs(".tsukigi-visual");
  if (!hero) return;

  const slides = qsa(".visual-slides img");
  const buttons = qsa(".visual-progress button");
  if (slides.length <= 1 || buttons.length === 0) return;

  let activeIndex = 0;
  let timer = null;
  const intervalMs = 5000;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });
    buttons.forEach((button, buttonIndex) => {
      const isActive = buttonIndex === activeIndex;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-current", isActive ? "true" : "false");
    });
    hero.style.setProperty("--slide-progress", `${((activeIndex + 1) / slides.length) * 100}%`);
  };

  const start = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => showSlide(activeIndex + 1), intervalMs);
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      showSlide(Number(button.dataset.slide || 0));
      start();
    });
  });

  hero.addEventListener("mouseenter", () => window.clearInterval(timer));
  hero.addEventListener("mouseleave", start);

  showSlide(0);
  start();
}

function hydrateListQuery() {
  const categoryFilter = qs("#category-filter");
  const areaFilter = qs("#area-filter");
  const keywordFilter = qs("#keyword-filter");
  if (!keywordFilter && !categoryFilter && !areaFilter) return;
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q") || "";
  const category = params.get("category") || "";
  const area = params.get("area") || "";
  if (category) state.category = category;
  if (area) state.area = area;
  if (query) {
    state.keyword = query;
  }
  if (categoryFilter) categoryFilter.value = state.category;
  if (areaFilter) areaFilter.value = state.area;
  if (keywordFilter) keywordFilter.value = state.keyword;
  qsa("[data-filter-category]").forEach((button) => {
    const isActive = button.dataset.filterCategory === state.category;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function renderDetailPage() {
  const detail = qs("#business-detail-page");
  if (!detail) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || businesses.find((business) => business.detailPage)?.id;
  const business = businesses.find((item) => item.id === id && item.detailPage);

  if (!business) {
    detail.innerHTML = `
      <section class="section">
        <p class="empty">この企業の詳しい紹介ページは現在準備中です。</p>
        <a class="button primary" href="./businesses.html">会員企業一覧へ戻る</a>
      </section>
    `;
    return;
  }

  detail.innerHTML = `
    <section class="detail-hero">
      <img src="${business.image}" alt="${business.name}のメイン写真">
      <div>
        <span class="plan-badge">${business.plan}</span>
        <p class="eyebrow">${business.category} / ${business.area}</p>
        <h1>${business.name}</h1>
        <p>${business.description}</p>
        <div class="detail-actions">${externalLinks(business)}</div>
      </div>
    </section>
    <section class="section detail-two-column">
      <div>
        <h2>企業紹介</h2>
        <p>${business.catchcopy}</p>
        <div class="tag-row">${business.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        <dl class="info-list">
          <div><dt>所在地</dt><dd>${business.address}</dd></div>
          <div><dt>電話</dt><dd>${phoneMarkup(business.phone)}</dd></div>
          <div><dt>メール</dt><dd><a href="mailto:${business.email}">${business.email}</a></dd></div>
          <div><dt>営業時間</dt><dd>${business.hours}</dd></div>
          <div><dt>定休日</dt><dd>${business.closed}</dd></div>
          <div><dt>決済</dt><dd>${business.payment.join(" / ")}</dd></div>
        </dl>
      </div>
      <aside class="contact-panel">
        <h2>すぐ確認できる情報</h2>
        <a href="tel:${business.phone}">電話する</a>
        <a href="mailto:${business.email}">メールする</a>
        <a href="${mapUrl(business)}" target="_blank" rel="noreferrer">Googleマップで開く</a>
        ${business.website ? `<a href="${business.website}" target="_blank" rel="noreferrer">ホームページ</a>` : ""}
        ${business.instagram ? `<a href="${business.instagram}" target="_blank" rel="noreferrer">Instagram</a>` : ""}
      </aside>
    </section>
    <section class="section gallery-section">
      <div class="section-heading">
        <p class="eyebrow">Photo Gallery</p>
        <h2>写真ギャラリー</h2>
        <p>お店や会社の雰囲気、商品・サービスの様子を写真で確認できます。</p>
      </div>
      <div class="gallery-grid">
        ${business.gallery.map((image, index) => `<img src="${image}" alt="${business.name} 写真${index + 1}" loading="lazy">`).join("")}
      </div>
    </section>
    <section class="section video-case-section">
      <div class="video-frame">
        <iframe src="${business.video}" title="${business.name} 紹介動画" allowfullscreen loading="lazy"></iframe>
      </div>
      <div>
        <p class="eyebrow">Works / Products</p>
        <h2>施工事例・商品紹介</h2>
        <div class="case-list">
          ${business.cases
            .map(
              (item) => `
            <article>
              <h3>${item.title}</h3>
              <p>${item.text}</p>
            </article>
          `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;

  prepareMotionItems(detail);
}

function prepareMotionItems(root = document) {
  if (!document.body.classList.contains("motion-ready")) return;

  const selectors = [
    ".section",
    ".section-heading",
    ".tsukigi-brand-row",
    ".tsukigi-newsline",
    ".tsukigi-pickup",
    ".portal-intro article",
    ".function-grid a",
    ".feature-lead-story",
    ".feature-card",
    ".interview-card",
    ".business-card",
    ".ad-card",
    ".about-grid article",
    ".existing-links a",
    ".news-list article",
    ".apply-section",
    ".page-hero",
    ".filters",
    ".directory-ad-slot",
    ".list-status",
    ".detail-hero",
    ".detail-two-column",
    ".gallery-grid img",
    ".video-case-section"
  ];

  const items = [...root.querySelectorAll(selectors.join(","))];

  items.forEach((item, index) => {
    if (!item.classList.contains("reveal-item")) {
      item.classList.add("reveal-item");
      item.style.setProperty("--reveal-delay", `${Math.min((index % 7) * 70, 420)}ms`);
    }
    if (revealObserver && !item.classList.contains("is-visible")) {
      revealObserver.observe(item);
    }
  });

  [...root.querySelectorAll("h1, h2, h3")]
    .filter((heading) => !heading.closest(".tsukigi-visual") && !heading.classList.contains("reveal-line"))
    .forEach((heading) => heading.classList.add("reveal-line"));
}

function setupPageMotion() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  document.body.classList.add("motion-ready");

  const progress = document.createElement("div");
  progress.className = "page-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.prepend(progress);

  const glow = document.createElement("div");
  glow.className = "motion-glow";
  glow.setAttribute("aria-hidden", "true");
  document.body.append(glow);

  let ticking = false;
  const updateScrollMotion = () => {
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progressValue = Math.min(window.scrollY / maxScroll, 1);
    document.documentElement.style.setProperty("--scroll-progress", progressValue.toFixed(4));
    document.documentElement.style.setProperty("--scroll-shift", `${Math.round(window.scrollY)}`);
    ticking = false;
  };

  const requestScrollMotion = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateScrollMotion);
  };

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.14
    }
  );

  prepareMotionItems(document);
  requestScrollMotion();
  window.addEventListener("scroll", requestScrollMotion, { passive: true });
  window.addEventListener("resize", requestScrollMotion);

  window.addEventListener("pointermove", (event) => {
    document.body.classList.add("pointer-active");
    document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);

    const hero = qs(".tsukigi-visual");
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const isInsideHero =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!isInsideHero) return;
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 28;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 28;
    hero.style.setProperty("--hero-x", `${x.toFixed(2)}px`);
    hero.style.setProperty("--hero-y", `${y.toFixed(2)}px`);
  });

  window.addEventListener("pointerleave", () => {
    document.body.classList.remove("pointer-active");
    qs(".tsukigi-visual")?.style.setProperty("--hero-x", "0px");
    qs(".tsukigi-visual")?.style.setProperty("--hero-y", "0px");
  });
}

function setupArticleLikes() {
  qsa("[data-like-id]").forEach((button) => {
    const likes = readLikes();
    const id = button.dataset.likeId;
    const base = Number(button.dataset.likeBase || 0);
    const record = likeRecord(likes, id, base);
    button.querySelector("strong").textContent = String(record.count);
    button.classList.toggle("is-liked", record.liked);
    button.disabled = record.liked;
    button.setAttribute("aria-pressed", record.liked ? "true" : "false");
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-like-id]");
    if (!button) return;
    const likes = readLikes();
    const id = button.dataset.likeId;
    const base = Number(button.dataset.likeBase || 0);
    const record = likeRecord(likes, id, base);
    if (record.liked) return;
    const next = record.count + 1;
    likes[id] = { count: next, liked: true };
    writeLikes(likes);
    button.querySelector("strong").textContent = String(next);
    button.classList.add("is-liked");
    button.disabled = true;
    button.setAttribute("aria-pressed", "true");
  });
}

renderFeatureList();
renderLatestArticles();
renderInterviews();
renderSeries();
renderRanking();
renderAdSlots();
renderBusinessPreview();
setupFilters();
hydrateListQuery();
setupHeroSearch();
setupHeroSlider();
setupArticleLikes();
renderBusinessList();
renderDetailPage();
setupPageMotion();
