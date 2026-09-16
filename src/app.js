(() => {
  const data=window.LUXPRINT_DATA,$=s=>document.querySelector(s);
  const catalog=$('#catalogScreen'),builder=$('#builderScreen'),grid=$('#productGrid'),categories=$('#categories'),search=$('#searchInput'),options=$('#optionsRoot'),price=$('#priceValue'),modal=$('#quoteModal');
  let activeCategory='Все',query='',qty=data.constructor.pricing.defaultQty,designName='Не загружен';
  const iconMarkup=t=>`<div class="product-icon product-icon--${t}"><i></i><b></b></div>`;
  function renderCategories(){categories.innerHTML=data.categories.map(c=>`<button class="category ${c===activeCategory?'active':''}" data-category="${c}">${c}</button>`).join('')}
  function renderProducts(){const list=data.products.filter(p=>(activeCategory==='Все'||p.category===activeCategory)&&(`${p.title} ${p.description}`.toLowerCase().includes(query)));grid.innerHTML=list.length?list.map(p=>`<article class="product-card ${p.configurable?'ready':''}" data-product="${p.id}"><div class="product-visual">${iconMarkup(p.icon)}${p.configurable?'<span class="ready-pill">3D</span>':''}</div><div class="product-copy"><span>${p.category}</span><h2>${p.title}</h2><p>${p.description}</p><button type="button">${p.configurable?'Настроить →':'Скоро'}</button></div></article>`).join(''):'<div class="empty-state">Ничего не найдено</div>'}
  function renderOptions(){
    options.innerHTML=`<section class="option-group"><h3><span>1</span>Характеристики</h3><div class="spec-list">${data.constructor.specs.map(s=>`<div><small>${s.label}</small><b>${s.value}</b></div>`).join('')}</div></section>
    <section class="option-group"><h3><span>2</span>Ваш дизайн</h3><label class="upload-box"><input id="designUpload" type="file" accept="image/png,image/jpeg,image/webp"><i>＋</i><div><b>Добавить свой дизайн</b><small id="designName">PNG, JPG или WEBP</small></div></label></section>
    <section class="option-group"><h3><span>3</span>Тираж</h3><div class="quantity"><button type="button" id="qtyMinus">−</button><strong id="qtyValue">${qty}</strong><span>шт.</span><button type="button" id="qtyPlus">+</button></div></section>`;
    $('#qtyMinus').onclick=()=>changeQty(-1);$('#qtyPlus').onclick=()=>changeQty(1);
    $('#designUpload').onchange=e=>{const file=e.target.files[0];if(!file)return;designName=file.name;$('#designName').textContent=file.name;window.LuxViewer.setDesign(file)};
  }
  function changeQty(d){qty=Math.max(1,qty+d);$('#qtyValue').textContent=qty;updatePrice()}
  function total(){return qty*data.constructor.pricing.perUnit}
  function updatePrice(){price.textContent=`${total().toLocaleString('ru-RU')} ₽`}
  function openBuilder(){catalog.classList.add('is-hidden');builder.classList.remove('is-hidden');scrollTo(0,0);setTimeout(()=>window.dispatchEvent(new Event('resize')),50);updatePrice()}
  function openQuote(){
    $('#quoteImage').src=window.LuxViewer.snapshot();
    $('#quoteDetails').innerHTML=`<div><span>Размер</span><b>297 × 210 мм</b></div><div><span>Материал</span><b>Плотная бумага, 270 г/м²</b></div><div><span>Печать</span><b>4 + 0</b></div><div><span>Дизайн</span><b>${designName}</b></div><div><span>Тираж</span><b>${qty} шт.</b></div><div class="quote-total"><span>Стоимость</span><b>${total().toLocaleString('ru-RU')} ₽</b></div>`;
    modal.classList.remove('is-hidden');
  }
  categories.onclick=e=>{const b=e.target.closest('[data-category]');if(!b)return;activeCategory=b.dataset.category;renderCategories();renderProducts()};
  grid.onclick=e=>{const c=e.target.closest('[data-product]');if(c&&data.products.find(p=>p.id===c.dataset.product)?.configurable)openBuilder()};
  search.oninput=e=>{query=e.target.value.trim().toLowerCase();renderProducts()};
  $('#backToCatalog').onclick=()=>{builder.classList.add('is-hidden');catalog.classList.remove('is-hidden')};
  $('#quoteButton').onclick=openQuote;$('#closeModal').onclick=()=>modal.classList.add('is-hidden');modal.onclick=e=>{if(e.target===modal)modal.classList.add('is-hidden')};
  $('#confirmQuote').onclick=()=>alert('Демонстрация готова. Следующий шаг — подключить отправку заявки в Bitrix.');
  renderCategories();renderProducts();renderOptions();updatePrice();window.LuxViewer.init();
})();