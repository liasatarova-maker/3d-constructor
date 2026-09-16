window.LUXPRINT_DATA = {
  categories: ["Все", "Полиграфия", "Наружная реклама", "Сувенирная продукция", "Наклейки", "Упаковка"],
  products: [
    { id: "calendar-house", title: "Календарь-домик", category: "Полиграфия", description: "Настольный календарь на пружине", icon: "calendar", configurable: true },
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
    groups: [
      { id: "size", label: "Размер", options: [
        { id: "210x100", label: "210 × 100 мм", price: 0 },
        { id: "250x120", label: "250 × 120 мм", price: 650 },
        { id: "210x148", label: "210 × 148 мм", price: 900 }
      ]},
      { id: "material", label: "Материал основания", options: [
        { id: "coated", label: "Мелованный картон", note: "Белый", price: 0, tone: "coated" },
        { id: "kraft", label: "Крафт-картон", note: "Натуральный", price: 450, tone: "kraft" },
        { id: "designer", label: "Дизайнерский картон", note: "Фактурный", price: 950, tone: "designer" }
      ]},
      { id: "print", label: "Печать", options: [
        { id: "4-0", label: "4 + 0", note: "С одной стороны", multiplier: 1 },
        { id: "4-4", label: "4 + 4", note: "С двух сторон", multiplier: 1.18 }
      ]}
    ],
    pricing: { setup: 2800, perUnit: 50, defaultQty: 100, qtyStep: 10, minQty: 10 }
  }
};