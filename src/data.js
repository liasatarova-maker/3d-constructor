window.LUXPRINT_DATA = {
  categories: ["Все", "Полиграфия", "Наружная реклама", "Сувенирная продукция", "Наклейки", "Упаковка"],
  products: [
    { id: "calendar-house", title: "Календарь-домик", category: "Полиграфия", description: "297 × 210 мм · плотная бумага 270 г/м²", icon: "calendar", configurable: true },
    { id: "business-cards", title: "Визитки", category: "Полиграфия", description: "Классические и дизайнерские", icon: "cards" },
    { id: "leaflets", title: "Листовки", category: "Полиграфия", description: "Рекламная и информационная печать", icon: "paper" },
    { id: "booklets", title: "Буклеты", category: "Полиграфия", description: "Фальцовка и разные форматы", icon: "booklet" },
    { id: "stickers", title: "Наклейки", category: "Наклейки", description: "Печать и контурная резка", icon: "sticker" },
    { id: "package", title: "Пакеты", category: "Упаковка", description: "Бумажные пакеты с печатью", icon: "bag" },
    { id: "signs", title: "Таблички", category: "Наружная реклама", description: "ПВХ, пластик и композит", icon: "sign" },
    { id: "letters", title: "Объёмные буквы", category: "Наружная реклама", description: "Световые и несветовые", icon: "letters" },
    { id: "souvenirs", title: "Сувенирная продукция", category: "Сувенирная продукция", description: "Брендирование предметов", icon: "gift" }
  ],
  constructor: {
    productId: "calendar-house",
    specs: [
      { label: "Размер", value: "297 × 210 мм" },
      { label: "Материал", value: "Плотная бумага, 270 г/м²" },
      { label: "Печать", value: "4 + 0" }
    ],
    pricing: { perUnit: 130, defaultQty: 1, qtyStep: 1, minQty: 1 }
  }
};