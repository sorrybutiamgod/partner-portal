/**
 * Russian Invoice & Sched-Factura generator with print and PDF capabilities
 */

// Helper to convert numbers to Russian words (число прописью)
export function numberToWordsRu(amount) {
  const units = [
    ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'],
    ['', 'одна', 'две', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять']
  ];
  const teens = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
  const tens = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
  const hundreds = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];

  const rubles = Math.floor(amount);
  const kopecks = Math.round((amount - rubles) * 100);

  if (rubles === 0) return `Ноль рублей ${String(kopecks).padStart(2, '0')} копеек`;

  function morph(n, f1, f2, f5) {
    n = Math.abs(n) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return f5;
    if (n1 > 1 && n1 < 5) return f2;
    if (n1 === 1) return f1;
    return f5;
  }

  function tripletToWords(triplet, gender) {
    let res = '';
    const h = Math.floor(triplet / 100);
    const d = Math.floor((triplet % 100) / 10);
    const u = triplet % 10;

    if (h > 0) res += hundreds[h] + ' ';
    if (d === 1) {
      res += teens[u] + ' ';
    } else {
      if (d > 1) res += tens[d] + ' ';
      if (u > 0) res += units[gender][u] + ' ';
    }
    return res;
  }

  let result = '';
  const millions = Math.floor(rubles / 1000000);
  const thousands = Math.floor((rubles % 1000000) / 1000);
  const rest = rubles % 1000;

  if (millions > 0) {
    result += tripletToWords(millions, 0) + morph(millions, 'миллион', 'миллиона', 'миллионов') + ' ';
  }
  if (thousands > 0) {
    result += tripletToWords(thousands, 1) + morph(thousands, 'тысяча', 'тысячи', 'тысяч') + ' ';
  }
  if (rest > 0) {
    result += tripletToWords(rest, 0);
  }

  result = result.trim();
  result = result.charAt(0).toUpperCase() + result.slice(1);
  const rubWord = morph(rubles, 'рубль', 'рубля', 'рублей');
  const kopWord = morph(kopecks, 'копейка', 'копейки', 'копеек');

  return `${result} ${rubWord} ${String(kopecks).padStart(2, '0')} ${kopWord}`;
}

export function printInvoiceDocument(order, company) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Пожалуйста, разрешите всплывающие окна для печати счёта-фактуры');
    return;
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Generate table rows
  let rowIdx = 1;
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="text-align:center;">${rowIdx++}</td>
      <td><strong>${item.article}</strong> — ${item.name} (${item.height}×${item.width}×${item.depth} мм)</td>
      <td style="text-align:center;">${item.quantity}</td>
      <td style="text-align:center;">шт.</td>
      <td style="text-align:right;">${item.unitBasePrice.toLocaleString('ru-RU')} ₽</td>
      <td style="text-align:right;">${item.totalBasePrice.toLocaleString('ru-RU')} ₽</td>
    </tr>
  `).join('');

  // Material extra row if any
  let materialRowHtml = '';
  if (order.material && (order.summary.materialMultiplier > 1 || order.summary.materialExtraSum > 0)) {
    const matSum = (order.summary.modulesBaseSum * (order.summary.materialMultiplier - 1)) + (order.summary.materialExtraSum || 0);
    materialRowHtml = `
      <tr>
        <td style="text-align:center;">${rowIdx++}</td>
        <td>Комплектация фасадов: <strong>${order.material.name}</strong> (наценка и финишная отделка)</td>
        <td style="text-align:center;">${order.summary.totalModulesCount}</td>
        <td style="text-align:center;">компл.</td>
        <td style="text-align:right;">${Math.round(matSum / order.summary.totalModulesCount).toLocaleString('ru-RU')} ₽</td>
        <td style="text-align:right;">${Math.round(matSum).toLocaleString('ru-RU')} ₽</td>
      </tr>
    `;
  }

  // Hinges extra row if upgraded
  let hingesRowHtml = '';
  if (order.hinges && order.summary.hingesExtraSum > 0) {
    hingesRowHtml = `
      <tr>
        <td style="text-align:center;">${rowIdx++}</td>
        <td>Фурнитура: <strong>${order.hinges.name}</strong></td>
        <td style="text-align:center;">${order.summary.totalModulesCount}</td>
        <td style="text-align:center;">компл.</td>
        <td style="text-align:right;">${order.hinges.pricePerUnit.toLocaleString('ru-RU')} ₽</td>
        <td style="text-align:right;">${order.summary.hingesExtraSum.toLocaleString('ru-RU')} ₽</td>
      </tr>
    `;
  }

  // Handles row if added
  let handlesRowHtml = '';
  if (order.handle && order.summary.handlesExtraSum > 0) {
    handlesRowHtml = `
      <tr>
        <td style="text-align:center;">${rowIdx++}</td>
        <td>Лицевая фурнитура / Ручки: <strong>${order.handle.name}</strong></td>
        <td style="text-align:center;">${order.summary.totalModulesCount}</td>
        <td style="text-align:center;">компл.</td>
        <td style="text-align:right;">${order.handle.pricePerUnit.toLocaleString('ru-RU')} ₽</td>
        <td style="text-align:right;">${order.summary.handlesExtraSum.toLocaleString('ru-RU')} ₽</td>
      </tr>
    `;
  }

  const totalWords = numberToWordsRu(order.summary.finalTotal);

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Счёт-фактура ${order.invoiceNumber} — ${company.name}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm 15mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      font-size: 12px;
      color: #000;
      margin: 0;
      padding: 20px;
      line-height: 1.35;
    }
    .print-control-bar {
      background: #0f172a;
      color: white;
      padding: 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 8px;
      margin-bottom: 25px;
    }
    .print-action-btn {
      background: #0284c7;
      color: white;
      border: none;
      padding: 9px 22px;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
      font-size: 14px;
    }
    @media print {
      .print-control-bar { display: none !important; }
      body { padding: 0; }
    }
    .notice {
      font-size: 10px;
      color: #555;
      text-align: center;
      margin-bottom: 8px;
    }
    table.bank-box {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
    }
    table.bank-box td {
      border: 1px solid #000;
      padding: 4px 6px;
      font-size: 11px;
    }
    h1.doc-title {
      font-size: 16px;
      font-weight: bold;
      border-bottom: 2px solid #000;
      padding-bottom: 5px;
      margin: 18px 0 12px 0;
    }
    .parties-table {
      width: 100%;
      margin-bottom: 15px;
    }
    .parties-table td {
      padding: 3px 0;
      font-size: 12px;
      vertical-align: top;
    }
    .parties-label {
      width: 110px;
      color: #333;
    }
    table.items-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      margin-bottom: 12px;
    }
    table.items-table th {
      border: 1px solid #000;
      padding: 5px;
      background: #f4f4f4;
      font-weight: bold;
      font-size: 11px;
    }
    table.items-table td {
      border: 1px solid #000;
      padding: 5px;
      font-size: 11px;
    }
    .totals-box {
      width: 100%;
      margin-bottom: 15px;
    }
    .totals-box td {
      padding: 3px 0;
      font-size: 12px;
    }
    .signatures-block {
      margin-top: 35px;
      display: flex;
      justify-content: space-between;
      position: relative;
    }
    .sig-col {
      width: 45%;
    }
    .sig-line {
      border-bottom: 1px solid #000;
      display: inline-block;
      width: 130px;
      margin: 0 5px;
    }
    .stamp-container {
      position: absolute;
      top: -25px;
      left: 170px;
      width: 130px;
      height: 130px;
      pointer-events: none;
    }
  </style>
</head>
<body>
  <div class="print-control-bar">
    <div><strong>Документ готов к печати:</strong> Счёт-фактура и спецификация заказа #${order.id}</div>
    <button class="print-action-btn" onclick="window.print()">Распечатать / Сохранить в PDF</button>
  </div>

  <div class="notice">
    Внимание! Оплата данного счёта означает согласие с условиями поставки товара. Уведомление об оплате обязательно.
  </div>

  <!-- Bank Requisites Box (1C standard) -->
  <table class="bank-box">
    <tr>
      <td colspan="2" rowspan="2" style="width: 55%; vertical-align:top;">
        ${company.bank}<br>
        <span style="font-size:10px; color:#555;">Банк получателя</span>
      </td>
      <td style="width: 12%;">БИК</td>
      <td style="width: 33%; font-weight:bold;">${company.bik}</td>
    </tr>
    <tr>
      <td>Сч. №</td>
      <td style="font-weight:bold;">${company.ks}</td>
    </tr>
    <tr>
      <td>ИНН ${company.inn}</td>
      <td>КПП ${company.kpp}</td>
      <td rowspan="2">Сч. №</td>
      <td rowspan="2" style="font-weight:bold; vertical-align:middle;">${company.rs}</td>
    </tr>
    <tr>
      <td colspan="2">
        ${company.legalName}<br>
        <span style="font-size:10px; color:#555;">Получатель</span>
      </td>
    </tr>
  </table>

  <h1 class="doc-title">
    СЧЁТ НА ОПЛАТУ И СЧЁТ-ФАКТУРА № ${order.invoiceNumber} от ${orderDate}
  </h1>

  <table class="parties-table">
    <tr>
      <td class="parties-label"><strong>Поставщик:</strong></td>
      <td><strong>${company.legalName}</strong>, ИНН ${company.inn}, КПП ${company.kpp}, ${company.address}, тел.: ${company.phone}</td>
    </tr>
    <tr>
      <td class="parties-label"><strong>Покупатель:</strong></td>
      <td><strong>${order.partnerName}</strong>${order.partnerInn ? `, ИНН ${order.partnerInn}` : ''}, ${order.deliveryAddress || 'г. Москва'}, тел.: ${order.partnerPhone}</td>
    </tr>
    <tr>
      <td class="parties-label"><strong>Основание:</strong></td>
      <td>Заказ модулей корпусной мебели № ${order.id} от ${new Date(order.createdAt).toLocaleDateString('ru-RU')}</td>
    </tr>
  </table>

  <!-- Items Table -->
  <table class="items-table">
    <thead>
      <tr>
        <th style="width: 25px;">№</th>
        <th>Товары (работы, услуги)</th>
        <th style="width: 45px;">Кол-во</th>
        <th style="width: 35px;">Ед.</th>
        <th style="width: 80px;">Цена</th>
        <th style="width: 85px;">Сумма</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
      ${materialRowHtml}
      ${hingesRowHtml}
      ${handlesRowHtml}
    </tbody>
  </table>

  <!-- Totals Box -->
  <table class="totals-box">
    <tr>
      <td style="text-align: right; width: 80%;"><strong>Итого без скидки:</strong></td>
      <td style="text-align: right; width: 20%; font-weight:bold;">${order.summary.subtotal.toLocaleString('ru-RU')} ₽</td>
    </tr>
    ${order.summary.discountPercent > 0 ? `
    <tr>
      <td style="text-align: right; color:#059669;"><strong>Партнёрская скидка (${order.summary.discountPercent}%):</strong></td>
      <td style="text-align: right; color:#059669; font-weight:bold;">-${order.summary.discountSum.toLocaleString('ru-RU')} ₽</td>
    </tr>
    ` : ''}
    <tr>
      <td style="text-align: right;"><strong>В том числе НДС (20%):</strong></td>
      <td style="text-align: right; font-weight:bold;">${order.summary.vatSum.toLocaleString('ru-RU')} ₽</td>
    </tr>
    <tr>
      <td style="text-align: right; font-size:14px;"><strong>Всего к оплате:</strong></td>
      <td style="text-align: right; font-size:14px; font-weight:bold;">${order.summary.finalTotal.toLocaleString('ru-RU')} ₽</td>
    </tr>
  </table>

  <div style="margin-top: 15px; font-size: 11px;">
    Всего наименований <strong>${rowIdx - 1}</strong>, на сумму <strong>${order.summary.finalTotal.toLocaleString('ru-RU')} ₽</strong><br>
    <strong>${totalWords}</strong>
  </div>

  <div style="border-bottom: 2px solid #000; margin: 15px 0 20px 0;"></div>

  <!-- Signatures and Official Stamp -->
  <div class="signatures-block">
    <div class="sig-col">
      <div>Руководитель <span class="sig-line"></span> (${company.director})</div>
    </div>
    <div class="sig-col" style="text-align: right;">
      <div>Главный бухгалтер <span class="sig-line"></span> (${company.accountant})</div>
    </div>

    <!-- Official SVG Blue Stamp -->
    <div class="stamp-container">
      <svg viewBox="0 0 160 160" width="130" height="130" style="opacity: 0.85; transform: rotate(-8deg);">
        <circle cx="80" cy="80" r="72" fill="none" stroke="#1d4ed8" stroke-width="2.5" stroke-dasharray="3, 1" />
        <circle cx="80" cy="80" r="67" fill="none" stroke="#1d4ed8" stroke-width="1.5" />
        <circle cx="80" cy="80" r="48" fill="none" stroke="#1d4ed8" stroke-width="1" />
        
        <path id="curveTop" d="M 24,80 A 56,56 0 0,1 136,80" fill="none" />
        <text font-size="8" font-weight="bold" fill="#1d4ed8" letter-spacing="1">
          <textPath href="#curveTop" startOffset="50%" text-anchor="middle">
            ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ
          </textPath>
        </text>

        <path id="curveBottom" d="M 136,80 A 56,56 0 0,1 24,80" fill="none" />
        <text font-size="8.5" font-weight="bold" fill="#1d4ed8" letter-spacing="1.5">
          <textPath href="#curveBottom" startOffset="50%" text-anchor="middle">
            * МОДУЛЬПРО СИСТЕМС *
          </textPath>
        </text>

        <text x="80" y="72" font-size="9" font-weight="bold" fill="#1d4ed8" text-anchor="middle">ДЛЯ</text>
        <text x="80" y="84" font-size="9" font-weight="bold" fill="#1d4ed8" text-anchor="middle">ДОКУМЕНТОВ</text>
        <text x="80" y="96" font-size="7.5" fill="#1d4ed8" text-anchor="middle">ИНН ${company.inn}</text>
      </svg>
    </div>
  </div>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
