import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const INITIAL_DATA = {
  company: {
    name: "МодульПро",
    brandTitle: "Фабрика модульных систем и мебельных компонентов",
    tagline: "Высокоточное серийное производство для мебельных салонов и дизайнеров",
    legalName: "ООО «МОДУЛЬПРО СИСТЕМС»",
    inn: "7724890124",
    kpp: "772401001",
    ogrn: "1217700456123",
    address: "г. Москва, 2-й Кабельный проезд, д. 2А, стр. 3",
    productionAddress: "Московская обл., г. Подольск, ул. Машиностроителей, 14",
    phone: "+7 (495) 789-44-22",
    mobilePhone: "+7 (926) 555-12-34",
    email: "partner@modulpro-factory.ru",
    workHours: "Пн–Пт: 09:00 – 19:00, Сб: 10:00 – 15:00",
    bank: "АО «ТИНЬКОФФ БАНК»",
    bik: "044525974",
    rs: "40702810910000854321",
    ks: "30101810145250000974",
    director: "Соколов Дмитрий Владимирович",
    accountant: "Васильева Елена Сергеевна",
    aboutText: "Мы производим стандартные и заказные модули для кухонь и корпусной мебели на немецком оборудовании HOMAG с ЧПУ. Используем европейскую фурнитуру и влагостойкие материалы. Кромкооблицовка на полиуретановом PUR-клее обеспечивает 100% защиту от влаги и незаметный клеевой шов.",
    advantages: [
      { title: "Точность ЧПУ 0.1 мм", desc: "Идеальная геометрия и сквозная присадка под фурнитуру" },
      { title: "PUR-кромление", desc: "Влагостойкость стыков фасадов и корпусов" },
      { title: "Срок от 5 дней", desc: "Быстрая отгрузка готовых модулей со склада и производства" },
      { title: "Официальный договор", desc: "Фиксированные партнёрские оптовые цены и гарантия 3 года" }
    ]
  },
  settings: {
    telegramBotToken: "",
    telegramChatId: "",
    telegramEnabled: true,
    adminEmailNotification: "admin@modulpro-factory.ru",
    invoiceVatRate: 20
  },
  users: [
    {
      id: "usr_admin",
      role: "admin",
      email: "admin@modulpro.ru",
      password: "admin",
      companyName: "Администрация МодульПро",
      contactPerson: "Главный диспетчер фабрики",
      phone: "+7 (495) 789-44-22",
      city: "Москва",
      discountPercent: 0
    },
    {
      id: "usr_partner_1",
      role: "partner",
      email: "partner@mebel-art.ru",
      password: "partner",
      companyName: "ИП Смирнов А.В. (Студия «Мебель-Арт»)",
      inn: "772398451020",
      contactPerson: "Алексей Смирнов",
      phone: "+7 (903) 123-45-67",
      city: "Москва",
      deliveryAddress: "г. Москва, шоссе Энтузиастов, д. 56, офис 204",
      discountPercent: 5
    }
  ],
  modules: [
    {
      id: "mod-1",
      article: "ВШ-400",
      category: "upper",
      categoryName: "Верхние модули",
      name: "Шкаф навесной одностворчатый 400",
      width: 400,
      height: 720,
      depth: 320,
      basePrice: 3800,
      description: "1 распашная створка, 2 внутренние полки с регулировкой по высоте, скрытые навесы Camar.",
      image: "cabinet_upper_single"
    },
    {
      id: "mod-2",
      article: "ВШ-600",
      category: "upper",
      categoryName: "Верхние модули",
      name: "Шкаф навесной двухстворчатый 600",
      width: 600,
      height: 720,
      depth: 320,
      basePrice: 5400,
      description: "2 распашные створки, 2 съёмные полки, усиленная задняя стенка ХДФ в паз.",
      image: "cabinet_upper_double"
    },
    {
      id: "mod-3",
      article: "ВШ-800-С",
      category: "upper",
      categoryName: "Верхние модули",
      name: "Шкаф навесной с сушкой посуды 800",
      width: 800,
      height: 720,
      depth: 320,
      basePrice: 7200,
      description: "Комплектуется двухуровневой сушкой из нержавеющей стали с алюминиевым поддоном.",
      image: "cabinet_upper_dryer"
    },
    {
      id: "mod-4",
      article: "ВШ-Г-600",
      category: "upper",
      categoryName: "Верхние модули",
      name: "Шкаф навесной горизонтальный 600 (Авентос)",
      width: 600,
      height: 360,
      depth: 320,
      basePrice: 4900,
      description: "Горизонтальный фасад под подъемный механизм Aventos HK-S / газовые лифты.",
      image: "cabinet_upper_lift"
    },
    {
      id: "mod-5",
      article: "ВШ-У-600",
      category: "upper",
      categoryName: "Верхние модули",
      name: "Шкаф навесной угловой 600х600",
      width: 600,
      height: 720,
      depth: 600,
      basePrice: 6800,
      description: "Угловой навесной элемент с диагональным фасадом и круговой полкой.",
      image: "cabinet_upper_corner"
    },
    {
      id: "mod-6",
      article: "НШ-400",
      category: "lower",
      categoryName: "Нижние модули",
      name: "Шкаф нижний одностворчатый 400",
      width: 400,
      height: 820,
      depth: 560,
      basePrice: 4500,
      description: "1 распашной фасад, 1 полка, регулируемые опоры 100 мм для цоколя.",
      image: "cabinet_lower_single"
    },
    {
      id: "mod-7",
      article: "НШ-600",
      category: "lower",
      categoryName: "Нижние модули",
      name: "Шкаф нижний распашной двухстворчатый 600",
      width: 600,
      height: 820,
      depth: 560,
      basePrice: 6200,
      description: "2 створки, большая полезная глубина, технологический отступ под коммуникации 50 мм.",
      image: "cabinet_lower_double"
    },
    {
      id: "mod-8",
      article: "НШ-Я-400",
      category: "lower",
      categoryName: "Нижние модули",
      name: "Шкаф нижний с 3 ящиками 400",
      width: 400,
      height: 820,
      depth: 560,
      basePrice: 8900,
      description: "1 малый ящик для столовых приборов + 2 глубоких выдвижных ящика.",
      image: "cabinet_lower_drawers3"
    },
    {
      id: "mod-9",
      article: "НШ-Я-600",
      category: "lower",
      categoryName: "Нижние модули",
      name: "Шкаф нижний с 2 глубокими ящиками 600",
      width: 600,
      height: 820,
      depth: 560,
      basePrice: 9800,
      description: "2 высоких выдвижных ящика большой грузоподъемности (до 40 кг) под кастрюли.",
      image: "cabinet_lower_drawers2"
    },
    {
      id: "mod-10",
      article: "НШ-М-600",
      category: "lower",
      categoryName: "Нижние модули",
      name: "Шкаф нижний под мойку 600",
      width: 600,
      height: 820,
      depth: 560,
      basePrice: 5900,
      description: "Усиленные алюминиевые траверсы, свободный доступ к сифону и фильтрам воды.",
      image: "cabinet_lower_sink"
    },
    {
      id: "mod-11",
      article: "НШ-У-900",
      category: "lower",
      categoryName: "Нижние модули",
      name: "Шкаф нижний угловой приставной 900",
      width: 900,
      height: 820,
      depth: 560,
      basePrice: 8400,
      description: "Приставной угловой модуль с фальш-планкой под стыковку с перпендикулярным рядом.",
      image: "cabinet_lower_corner"
    },
    {
      id: "mod-12",
      article: "П-600-Д",
      category: "tall",
      categoryName: "Пеналы и колонны",
      name: "Пенал под встроенную духовку и СВЧ 600",
      width: 600,
      height: 2040,
      depth: 560,
      basePrice: 14500,
      description: "Ниша под духовку 600мм + ниша СВЧ 380мм, нижний выдвижной ящик и верхний антресольный шкаф.",
      image: "cabinet_tall_oven"
    },
    {
      id: "mod-13",
      article: "П-600-Х",
      category: "tall",
      categoryName: "Пеналы и колонны",
      name: "Пенал под встраиваемый холодильник 600",
      width: 600,
      height: 2040,
      depth: 560,
      basePrice: 16200,
      description: "Двухдверный пенал с вентиляционной решеткой в базе под встраиваемую технику.",
      image: "cabinet_tall_fridge"
    },
    {
      id: "mod-14",
      article: "П-400-П",
      category: "tall",
      categoryName: "Пеналы и колонны",
      name: "Пенал хозяйственный с полками 400",
      width: 400,
      height: 2040,
      depth: 560,
      basePrice: 12800,
      description: "Высокий распашной шкаф-колонна с 5 полками для хранения припасов и посуды.",
      image: "cabinet_tall_storage"
    }
  ],
  materials: [
    {
      id: "mat-1",
      name: "ЛДСП Egger 18 мм (Стандарт)",
      code: "EGGER-18",
      multiplier: 1.0,
      extraCostPerModule: 0,
      description: "Австрийское качество, экологичность E0.5, устойчивость к царапинам, кромка 1 мм PUR.",
      badge: "Базовый",
      colorSample: "#c4a482"
    },
    {
      id: "mat-2",
      name: "МДФ Пленка ПВХ Soft-touch",
      code: "MDF-PVC-SOFT",
      multiplier: 1.25,
      extraCostPerModule: 1100,
      description: "Шелковисто-матовое покрытие без отпечатков пальцев, влагостойкая мембрана.",
      badge: "Популярный",
      colorSample: "#475569"
    },
    {
      id: "mat-3",
      name: "МДФ Эмаль Матовая (RAL / NCS)",
      code: "MDF-ENAMEL-MATT",
      multiplier: 1.48,
      extraCostPerModule: 2400,
      description: "Глубокая двусторонняя покраска в 4 слоя, колеровка в любой из 2000+ оттенков палитры.",
      badge: "Премиум",
      colorSample: "#0f766e"
    },
    {
      id: "mat-4",
      name: "МДФ Эмаль Высокий Глянец",
      code: "MDF-ENAMEL-GLOSS",
      multiplier: 1.62,
      extraCostPerModule: 3100,
      description: "Зеркальный блеск с алмазной полировкой, визуально расширяет пространство.",
      badge: "Люкс",
      colorSample: "#1e3a8a"
    },
    {
      id: "mat-5",
      name: "Нанопластик Fenix NTM (Италия)",
      code: "FENIX-NTM",
      multiplier: 1.78,
      extraCostPerModule: 4200,
      description: "Инновационный суперматовый пластик с термическим самозаживлением микроцарапин.",
      badge: "Топ-дизайн",
      colorSample: "#18181b"
    },
    {
      id: "mat-6",
      name: "Натуральный Шпон Дуба / Ясеня",
      code: "WOOD-VENEER",
      multiplier: 1.95,
      extraCostPerModule: 5600,
      description: "Живая текстура благородного дерева, покрытая матовым износостойким акриловым лаком.",
      badge: "Эко-премиум",
      colorSample: "#78350f"
    }
  ],
  hardware: [
    {
      id: "hd-1",
      category: "hinges",
      name: "Петли Boyard с доводчиком (Базовые)",
      pricePerUnit: 0,
      description: "Включены в стоимость модуля по умолчанию. Доводчик плавного закрывания.",
      type: "included"
    },
    {
      id: "hd-2",
      category: "hinges",
      name: "Петли Blum Clip Top Blumotion (Австрия)",
      pricePerUnit: 950,
      description: "Флагманская надежность Blum, встроенный доводчик, гарантия 200 000 циклов.",
      type: "upgrade"
    },
    {
      id: "hd-3",
      category: "hinges",
      name: "Петли Hettich Sensys с демпфером (Германия)",
      pricePerUnit: 1100,
      description: "Немецкая фурнитура премиум-класса с широким углом самозатягивания от 35°.",
      type: "upgrade"
    },
    {
      id: "hd-4",
      category: "handles",
      name: "Без ручек / Интегрированный профиль Gola Черный",
      pricePerUnit: 1200,
      description: "Скрытый горизонтальный и вертикальный профиль Gola в цвете черный браш.",
      type: "handle"
    },
    {
      id: "hd-5",
      category: "handles",
      name: "Система Push-to-Open (Открывание нажатием)",
      pricePerUnit: 850,
      description: "Механизм Tip-On / Push для минималистичных фасадов без выступающих ручек.",
      type: "handle"
    },
    {
      id: "hd-6",
      category: "handles",
      name: "Ручка-скоба Loft матовый черный (160 мм)",
      pricePerUnit: 350,
      description: "Стильная металлическая ручка-скоба со стойким порошковым напылением.",
      type: "handle"
    },
    {
      id: "hd-7",
      category: "handles",
      name: "Ручка-кнопка Латунь Браш (32 мм)",
      pricePerUnit: 280,
      description: "Элегантная золотистая ручка цилиндрической формы для классики и неоклассики.",
      type: "handle"
    },
    {
      id: "hd-8",
      category: "handles",
      name: "Ручка торцевая врезная алюминиевая (Черная)",
      pricePerUnit: 420,
      description: "Торцевой профиль, монтируемый на верхнюю кромку фасада без сверления лицевой части.",
      type: "handle"
    }
  ],
  // NEW FEATURE 1: READY-TO-ORDER POPULAR KITCHEN SETS (Готовые типовые комплекты)
  readySets: [
    {
      id: "set-1",
      title: "Прямая кухня «Линейная 2.4 м»",
      subtitle: "Хит продаж для салонов и арендного жилья",
      lengthMm: 2400,
      modulesCount: 7,
      recommendedMaterialId: "mat-2", // Soft-touch
      recommendedHingesId: "hd-2", // Blum
      recommendedHandleId: "hd-6", // Loft
      description: "Оптимальная линейная компоновка: сушка 800мм, распашные шкафы, глубокие ящики и модуль под мойку.",
      items: { "mod-3": 1, "mod-2": 1, "mod-4": 1, "mod-10": 1, "mod-9": 1, "mod-7": 1 },
      basePrice: 44300,
      badge: "Хит 2026",
      readyTimeDays: 5
    },
    {
      id: "set-2",
      title: "Угловая кухня «Эргономика 3.0 × 1.5 м»",
      subtitle: "Идеально для типовых квартир с максимальным хранением",
      lengthMm: 3000,
      modulesCount: 9,
      recommendedMaterialId: "mat-3", // Эмаль
      recommendedHingesId: "hd-2", // Blum
      recommendedHandleId: "hd-4", // Gola
      description: "Угловой навесной и напольный модули, 2 шкафа с выдвижными ящиками, высокий антресольный ряд.",
      items: { "mod-5": 1, "mod-2": 2, "mod-1": 1, "mod-11": 1, "mod-8": 1, "mod-9": 1, "mod-10": 1 },
      basePrice: 62700,
      badge: "Популярный угловой",
      readyTimeDays: 7
    },
    {
      id: "set-3",
      title: "Премиум комплект с пеналами «Hi-Tech 3.6 м»",
      subtitle: "Флагманский проект под встроенную технику",
      lengthMm: 3600,
      modulesCount: 8,
      recommendedMaterialId: "mat-5", // Fenix
      recommendedHingesId: "hd-3", // Hettich
      recommendedHandleId: "hd-4", // Gola
      description: "Два высоких пенала (под духовку и встроенный холодильник), модули с широкими ящиками 600мм и навесные Авентос.",
      items: { "mod-12": 1, "mod-13": 1, "mod-4": 2, "mod-3": 1, "mod-9": 2, "mod-10": 1 },
      basePrice: 87100,
      badge: "Флагман",
      readyTimeDays: 9
    },
    {
      id: "set-4",
      title: "Компакт «Студия 1.8 м»",
      subtitle: "Быстрый запуск для студий и смарт-квартир",
      lengthMm: 1800,
      modulesCount: 5,
      recommendedMaterialId: "mat-1", // Egger
      recommendedHingesId: "hd-1", // Boyard
      recommendedHandleId: "hd-5", // Push
      description: "Минимум пространства, максимум функционала: шкаф 600 под мойку, шкаф 600 с ящиками и навесные шкафы.",
      items: { "mod-2": 1, "mod-1": 1, "mod-10": 1, "mod-8": 1, "mod-6": 1 },
      basePrice: 29800,
      badge: "Эконом B2B",
      readyTimeDays: 3
    }
  ],
  // NEW FEATURE 2: DECORS & TEXTURE SAMPLES (Библиотека декоров и сэмпл-бокс)
  decors: [
    { id: "dec-1", name: "Белый Альпийский Премиум", ral: "RAL 9003", category: "soft", texture: "Шелковисто-матовый Soft", hex: "#f8fafc", popular: true },
    { id: "dec-2", name: "Антрацит Графитовый", ral: "RAL 7016", category: "soft", texture: "Глубокий матовый бархат", hex: "#262b33", popular: true },
    { id: "dec-3", name: "Кашемир Серый Теплый", ral: "NCS S 2005-Y50R", category: "soft", texture: "Матовый сатин", hex: "#c7beaf", popular: true },
    { id: "dec-4", name: "Дуб Галифакс Натуральный", code: "Egger H1180", category: "wood", texture: "Синхронные поры дерева", hex: "#9b7852", popular: true },
    { id: "dec-5", name: "Орех Пацифик Табак", code: "Egger H3702", category: "wood", texture: "Глубокая древесная текстура", hex: "#594233", popular: false },
    { id: "dec-6", name: "Бетон Чикаго Темно-серый", code: "Egger F187", category: "stone", texture: "Минеральная штукатурка", hex: "#4b4f54", popular: true },
    { id: "dec-7", name: "Fenix NTM Черный Инго", code: "Fenix 0720", category: "nano", texture: "Нано-термопластик суперматовый", hex: "#111113", popular: true },
    { id: "dec-8", name: "Fenix NTM Зеленый Комодо", code: "Fenix 0750", category: "nano", texture: "Матовый благородный изумруд", hex: "#22352d", popular: false },
    { id: "dec-9", name: "Винно-красный Бордо", ral: "RAL 3005", category: "gloss", texture: "Алмазный глянец полированный", hex: "#5c141d", popular: false },
    { id: "dec-10", name: "Эмаль Изумрудный Глубокий", ral: "RAL 6005", category: "enamel", texture: "Эмаль Renner 4 слоя", hex: "#133a27", popular: false },
    { id: "dec-11", name: "Шпон Ясеня Беленый", code: "Ash-01", category: "wood", texture: "Натуральный радиальный срез", hex: "#d8cbb7", popular: false },
    { id: "dec-12", name: "Шпон Мореного Дуба", code: "Oak-Bog", category: "wood", texture: "Шелковистый полиуретановый лак", hex: "#3b2f29", popular: true }
  ],
  // NEW FEATURE 3: DOWNLOAD CENTER & CAD TECH DOCS (Техническая база)
  docs: [
    {
      id: "doc-1",
      title: "Схемы сквозной присадки модулей (HOMAG 32 мм)",
      format: "PDF / CAD",
      size: "4.8 МБ",
      category: "tech",
      desc: "Точные чертежи позиционирования эксцентриков Rastex, шкантов и направляющих скрытого монтажа."
    },
    {
      id: "doc-2",
      title: "Библиотека 3D-модулей фабрики (Базис-Мебельщик)",
      format: "FR3D / BAZIS",
      size: "18.2 МБ",
      category: "cad",
      desc: "Готовые параметрические блоки модулей со всеми материалами и крепежом для быстрого проектирования."
    },
    {
      id: "doc-3",
      title: "3D-модели для 3ds Max + Corona Renderer (OBJ/FBX)",
      format: "ZIP / FBX",
      size: "42.0 МБ",
      category: "cad",
      desc: "Сетка высокой детализации и настроенные PBR-материалы для дизайнерских визуализаций."
    },
    {
      id: "doc-4",
      title: "Инструкция по монтажу и регулировке фурнитуры Blum / Hettich",
      format: "PDF",
      size: "2.1 МБ",
      category: "manual",
      desc: "Пошаговый регламент сборщика: регулировка фасадов по 3 осям, установка подъемников Aventos."
    },
    {
      id: "doc-5",
      title: "Сертификат соответствия ГОСТ 16371-2014 и санитарный паспорт E0.5",
      format: "PDF",
      size: "1.4 МБ",
      category: "legal",
      desc: "Официальные сертификаты качества на используемое сырье, клей PUR и ЛДСП Egger."
    },
    {
      id: "doc-6",
      title: "Типовой договор поставки мебельных полуфабрикатов (B2B)",
      format: "DOCX / PDF",
      size: "340 КБ",
      category: "legal",
      desc: "Договор с фиксированными оптовыми ценами, сроками производства и гарантийными обязательствами 3 года."
    }
  ],
  // NEW FEATURE 4: LOYALTY TIERS (Программа лояльности партнёра)
  loyaltyTiers: [
    { name: "Start Partner", minTurnover: 0, maxTurnover: 300000, discount: 5, perks: ["Доступ к оптовым ценам", "Telegram-уведомления", "Электронный документооборот"] },
    { name: "Silver Partner", minTurnover: 300000, maxTurnover: 1000000, discount: 8, perks: ["Скидка 8% на все модули", "Приоритетная очередь раскроя ЧПУ", "Бесплатный сэмпл-бокс декоров"] },
    { name: "Gold Partner", minTurnover: 1000000, maxTurnover: 2500000, discount: 12, perks: ["Скидка 12%", "Бесплатная доставка до склада партнёра", "Персональный инженер-технолог"] },
    { name: "Platinum VIP", minTurnover: 2500000, maxTurnover: 10000000, discount: 15, perks: ["Скидка 15%", "Отсрочка платежа 14 дней", "Индивидуальная фрезеровка фасадов"] }
  ],
  orders: [
    {
      id: "ORD-2026-0038",
      orderNumber: 38,
      createdAt: "2026-09-28T14:20:00.000Z",
      partnerId: "usr_partner_1",
      partnerName: "ИП Смирнов А.В. (Студия «Мебель-Арт»)",
      partnerPhone: "+7 (903) 123-45-67",
      partnerEmail: "partner@mebel-art.ru",
      partnerInn: "772398451020",
      deliveryAddress: "г. Москва, шоссе Энтузиастов, д. 56",
      status: "completed",
      statusLabel: "Отгружен",
      items: [
        { moduleId: "mod-1", name: "Шкаф навесной одностворчатый 400", article: "ВШ-400", quantity: 2, unitBasePrice: 3800, totalBasePrice: 7600 },
        { moduleId: "mod-2", name: "Шкаф навесной двухстворчатый 600", article: "ВШ-600", quantity: 1, unitBasePrice: 5400, totalBasePrice: 5400 },
        { moduleId: "mod-8", name: "Шкаф нижний с 3 ящиками 400", article: "НШ-Я-400", quantity: 2, unitBasePrice: 8900, totalBasePrice: 17800 },
        { moduleId: "mod-10", name: "Шкаф нижний под мойку 600", article: "НШ-М-600", quantity: 1, unitBasePrice: 5900, totalBasePrice: 5900 }
      ],
      material: { id: "mat-2", name: "МДФ Пленка ПВХ Soft-touch", multiplier: 1.25, extraCostPerModule: 1100 },
      hinges: { id: "hd-2", name: "Петли Blum Clip Top Blumotion", pricePerUnit: 950 },
      handle: { id: "hd-6", name: "Ручка-скоба Loft матовый черный (160 мм)", pricePerUnit: 350 },
      comment: "Срочный заказ для выставочного образца салона.",
      summary: {
        totalModulesCount: 6,
        modulesBaseSum: 36700,
        materialMultiplier: 1.25,
        materialExtraSum: 6600,
        hingesExtraSum: 5700,
        handlesExtraSum: 2100,
        subtotal: 51100,
        discountPercent: 5,
        discountSum: 2555,
        finalTotal: 48545,
        vatSum: 8090.83
      },
      invoiceNumber: "СФ-2026/0038"
    }
  ]
};

const IS_VERCEL = !!process.env.VERCEL;
const LOCAL_DATA_DIR = path.join(process.cwd(), 'data');
const LOCAL_DB_FILE = path.join(LOCAL_DATA_DIR, 'db.json');
const TMP_DATA_DIR = path.join('/tmp', 'partner_portal_data');
const TMP_DB_FILE = path.join(TMP_DATA_DIR, 'db.json');

// In-memory cache to guarantee zero-latency and resilience across lambda invocations
let inMemoryDb = null;

function getActiveDbPath() {
  if (IS_VERCEL) {
    return TMP_DB_FILE;
  }
  return LOCAL_DB_FILE;
}

function ensureDbFile() {
  if (inMemoryDb) return;

  if (IS_VERCEL) {
    try {
      if (!fs.existsSync(TMP_DATA_DIR)) {
        fs.mkdirSync(TMP_DATA_DIR, { recursive: true });
      }
      if (!fs.existsSync(TMP_DB_FILE)) {
        if (fs.existsSync(LOCAL_DB_FILE)) {
          const content = fs.readFileSync(LOCAL_DB_FILE, 'utf-8');
          fs.writeFileSync(TMP_DB_FILE, content, 'utf-8');
        } else {
          fs.writeFileSync(TMP_DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
        }
      }
    } catch (e) {
      console.warn("Could not setup /tmp on Vercel, will use memory fallback:", e);
    }
    return;
  }

  // Local development
  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LOCAL_DB_FILE)) {
      fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
    } else {
      try {
        const current = JSON.parse(fs.readFileSync(LOCAL_DB_FILE, 'utf-8'));
        let changed = false;
        if (!current.readySets) { current.readySets = INITIAL_DATA.readySets; changed = true; }
        if (!current.decors) { current.decors = INITIAL_DATA.decors; changed = true; }
        if (!current.docs) { current.docs = INITIAL_DATA.docs; changed = true; }
        if (!current.loyaltyTiers) { current.loyaltyTiers = INITIAL_DATA.loyaltyTiers; changed = true; }
        if (changed) {
          fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(current, null, 2), 'utf-8');
        }
      } catch (e) {
        console.warn("Could not check/migrate db.json, ignoring", e);
      }
    }
  } catch (err) {
    console.warn("Local fs setup error:", err);
  }
}

export function getDb() {
  if (inMemoryDb) {
    return inMemoryDb;
  }
  ensureDbFile();

  const targetPath = getActiveDbPath();
  try {
    if (fs.existsSync(targetPath)) {
      const raw = fs.readFileSync(targetPath, 'utf-8');
      const parsed = JSON.parse(raw);
      parsed.readySets = parsed.readySets || INITIAL_DATA.readySets;
      parsed.decors = parsed.decors || INITIAL_DATA.decors;
      parsed.docs = parsed.docs || INITIAL_DATA.docs;
      parsed.loyaltyTiers = parsed.loyaltyTiers || INITIAL_DATA.loyaltyTiers;
      inMemoryDb = parsed;
      return inMemoryDb;
    }
  } catch (err) {
    console.error('Error reading db from', targetPath, err);
  }

  // Fallback to local file if on Vercel and /tmp failed
  if (IS_VERCEL) {
    try {
      if (fs.existsSync(LOCAL_DB_FILE)) {
        const raw = fs.readFileSync(LOCAL_DB_FILE, 'utf-8');
        inMemoryDb = JSON.parse(raw);
        return inMemoryDb;
      }
    } catch (e) {}
  }

  inMemoryDb = JSON.parse(JSON.stringify(INITIAL_DATA));
  return inMemoryDb;
}

export function saveDb(data) {
  inMemoryDb = data;
  ensureDbFile();

  const targetPath = getActiveDbPath();
  try {
    const tempFile = `${targetPath}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, targetPath);
  } catch (err) {
    console.warn('Could not write to disk at', targetPath, 'maintaining in-memory state:', err);
    if (!IS_VERCEL) {
      try {
        if (!fs.existsSync(TMP_DATA_DIR)) fs.mkdirSync(TMP_DATA_DIR, { recursive: true });
        fs.writeFileSync(TMP_DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      } catch (e2) {}
    }
  }
}
