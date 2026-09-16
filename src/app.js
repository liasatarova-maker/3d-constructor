(() => {
  const data = window.LUXPRINT_DATA;
  const catalogScreen = document.getElementById("catalogScreen");
  const builderScreen = document.getElementById("builderScreen");
  const grid = document.getElementById("productGrid");
  const categories = document.getElementById("categories");
  const search = document.getElementById("searchInput");
  const optionsRoot = document.getElementById("optionsRoot");
  const priceValue = document.getElementById("priceValue");
  let activeCategory = "Все";
  let query = "";
  let qty = data.constructor.pricing.defaultQty;
  const selected = {};
  data.constructor.groups.forEach(group => selected[group.id] = group.options[0].id);

  const iconMarkup = (type) => `<div class="product-icon product-icon--${type}"><i></i><b></b></div>`;

  function renderCategories() {
    categories.innerHTML = data.categories.map(c => `<button class="category ${c === activeCategory ? "active" : ""}" data-category="${c}">${c}</button>`).join("");
  }

  function renderProducts() {
    const list = data.products.filter(p => (activeCategory === "Все" || p.category === activeCategory) && (`${p.title} ${p.description}`.toLowerCase().includes(query)));
    grid.innerHTML = list.length ? list.map(p => `
      <article class="product-card ${p.configurable ? "ready" : ""}" data-product="${p.id}">
        <div class="product-visual">${iconMarkup(p.icon)}${p.configurable ? '<span class="ready-pill">3D</span>' : ''}</div>
        <div class="product-copy"><span>${p.category}</span><h2>${p.title}</h2><p>${p.description}</p><button type="button">${p.configurable ? "Настроить →" : "Скоро"}</button></div>
      </article>`).join("") : `<div class="empty-state">Ничего не найдено</div>`;
  }

  function renderOptions() {
    optionsRoot.innerHTML = data.constructor.groups.map((group, index) => `
      <section class="option-group">
        <h3><span>${index + 1}</span>${group.label}</h3>
        <div class="option-list" data-group="${group.id}">
          ${group.options.map(o => `<button type="button" class="option ${selected[group.id] === o.id ? "active" : ""}" data-option="${o.id}">${o.tone ? `<i class="material-swatch ${o.tone}"></i>` : ""}<b>${o.label}</b>${o.note ? `<small>${o.note}</small>` : ""}</button>`).join("")}
        </div>
      </section>`).join("") + `
      <section class="option-group"><h3><span>4</span>Тираж</h3><div class="quantity"><button type="button" id="qtyMinus">−</button><strong id="qtyValue">${qty}</strong><span>шт.</span><button type="button" id="qtyPlus">+</button></div></section>`;
    document.getElementById("qtyMinus").onclick = () => changeQty(-data.constructor.pricing.qtyStep);
    document.getElementById("qtyPlus").onclick = () => changeQty(data.constructor.pricing.qtyStep);
  }

  function changeQty(delta) {
    qty = Math.max(data.constructor.pricing.minQty, qty + delta);
    document.getElementById("qtyValue").textContent = qty;
    updatePrice();
  }

  function findOption(groupId) {
    const group = data.constructor.groups.find(g => g.id === groupId);
    return group.options.find(o => o.id === selected[groupId]);
  }

  function updatePrice() {
    const pricing = data.constructor.pricing;
    const size = findOption("size");
    const material = findOption("material");
    const print = findOption("print");
    const base = pricing.setup + qty * pricing.perUnit + (size.price || 0) + (material.price || 0);
    const total = Math.round(base * (print.multiplier || 1));
    priceValue.textContent = `${total.toLocaleString("ru-RU")} ₽`;
  }

  function openBuilder() {
    catalogScreen.classList.add("is-hidden");
    builderScreen.classList.remove("is-hidden");
    window.scrollTo(0, 0);
    updatePrice();
  }

  categories.onclick = e => {
    const btn = e.target.closest("[data-category]"); if (!btn) return;
    activeCategory = btn.dataset.category; renderCategories(); renderProducts();
  };
  grid.onclick = e => {
    const card = e.target.closest("[data-product]"); if (!card) return;
    const product = data.products.find(p => p.id === card.dataset.product);
    if (product?.configurable) openBuilder();
  };
  search.oninput = e => { query = e.target.value.trim().toLowerCase(); renderProducts(); };
  optionsRoot.onclick = e => {
    const btn = e.target.closest("[data-option]"); if (!btn) return;
    const list = btn.closest("[data-group]");
    selected[list.dataset.group] = btn.dataset.option;
    list.querySelectorAll(".option").forEach(x => x.classList.toggle("active", x === btn));
    if (list.dataset.group === "material") window.LuxViewer.setMaterial(findOption("material").tone);
    updatePrice();
  };
  document.getElementById("backToCatalog").onclick = () => { builderScreen.classList.add("is-hidden"); catalogScreen.classList.remove("is-hidden"); };
  document.getElementById("quoteButton").onclick = () => alert("На следующем этапе подключим отправку конфигурации в заявку / Bitrix.");

  renderCategories(); renderProducts(); renderOptions(); updatePrice(); window.LuxViewer.init();
})();