const businesses = [...window.SHINGU_DATA.businesses].sort((a, b) => a.planRank - b.planRank);
const features = window.SHINGU_DATA.features;
const latestArticles = window.SHINGU_DATA.latestArticles;
const interviews = window.SHINGU_DATA.interviews;
const series = window.SHINGU_DATA.series;
const adSlots = window.SHINGU_DATA.adSlots;

const state = {
  category: "",
  area: "",
  keyword: ""
};

let revealObserver = null;

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return [...document.querySelectorAll(selector)];
}

function mapUrl(business) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`;
}

function externalLinks(business, compact = false) {
  const links = [
    business.website
      ? `<a href="${business.website}" target="_blank" rel="noreferrer">HP</a>`
      : "",
    `<a href="${mapUrl(business)}" target="_blank" rel="noreferrer">Googleマップ</a>`,
    business.instagram
      ? `<a href="${business.instagram}" target="_blank" rel="noreferrer">Instagram</a>`
      : "",
    compact ? "" : `<a href="tel:${business.phone}">電話</a>`
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
    : `<span class="card-note">基本情報を掲載中</span>`;

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
            <div><dt>電話</dt><dd><a href="tel:${business.phone}">${business.phone}</a></dd></div>
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
        <img src="${feature.image}" alt="${feature.title}のイメージ写真" loading="lazy">
        <div>
          <span>${feature.category}</span>
          <time>${feature.date}</time>
          <h3>${feature.title}</h3>
          <p>${feature.excerpt}</p>
          <small>#${feature.tag}</small>
        </div>
      </article>
    `
    )
    .join("");
}

function articleCard(article) {
  return `
    <article class="article-card">
      <img src="${article.image}" alt="${article.title}のイメージ写真" loading="lazy">
      <div>
        <span>${article.category}</span>
        <time>${article.date}</time>
        <h3>${article.title}</h3>
        <p>${article.excerpt}</p>
        <small>${article.author}</small>
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

  fillSelect(categoryFilter, uniqueValues("category"));
  fillSelect(areaFilter, uniqueValues("area"));

  categoryFilter?.addEventListener("change", (event) => {
    state.category = event.target.value;
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

  reset?.addEventListener("click", () => {
    state.category = "";
    state.area = "";
    state.keyword = "";
    if (categoryFilter) categoryFilter.value = "";
    if (areaFilter) areaFilter.value = "";
    if (keywordFilter) keywordFilter.value = "";
    renderBusinessList();
  });
}

function setupHeroSearch() {
  const heroQuery = qs("#hero-query");
  const heroButton = qs("#hero-search-button");
  if (!heroQuery || !heroButton) return;

  const goToList = () => {
    const params = new URLSearchParams();
    if (heroQuery.value.trim()) params.set("q", heroQuery.value.trim());
    window.location.href = `./businesses.html${params.toString() ? `?${params}` : ""}`;
  };

  heroButton.addEventListener("click", goToList);
  heroQuery.addEventListener("keydown", (event) => {
    if (event.key === "Enter") goToList();
  });

  qsa(".quick-tags button").forEach((button) => {
    button.addEventListener("click", () => {
      heroQuery.value = button.dataset.tag;
      goToList();
    });
  });
}

function hydrateListQuery() {
  const keywordFilter = qs("#keyword-filter");
  if (!keywordFilter) return;
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q") || "";
  if (query) {
    state.keyword = query;
    keywordFilter.value = query;
  }
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
          <div><dt>電話</dt><dd><a href="tel:${business.phone}">${business.phone}</a></dd></div>
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
        <p>企業の雰囲気や商品が伝わる写真を掲載し、来訪前に魅力を確認できるようにします。</p>
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

  const items = [...root.querySelectorAll(selectors.join(","))]
    .filter((item) => !item.classList.contains("reveal-item"));

  items.forEach((item, index) => {
    item.classList.add("reveal-item");
    item.style.setProperty("--reveal-delay", `${Math.min((index % 7) * 70, 420)}ms`);
    if (revealObserver) revealObserver.observe(item);
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

renderFeatureList();
renderLatestArticles();
renderInterviews();
renderSeries();
renderRanking();
renderAdSlots();
renderBusinessPreview();
hydrateListQuery();
setupFilters();
setupHeroSearch();
renderBusinessList();
renderDetailPage();
setupPageMotion();
