/**
 * Client-side PDF Catalog and Invoice generator using HTML/Print and jsPDF
 */

export function downloadModulesCatalogPDF(company, modules, materials) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Пожалуйста, разрешите всплывающие окна для формирования PDF-каталога');
    return;
  }

  const upperModules = modules.filter(m => m.category === 'upper');
  const lowerModules = modules.filter(m => m.category === 'lower');
  const tallModules = modules.filter(m => m.category === 'tall');

  const renderModuleRows = (list) => list.map((m, idx) => `
    <tr>
      <td style="text-align:center; color:#64748b; font-weight:600;">${idx + 1}</td>
      <td style="font-weight:700; color:#0f172a;">${m.article}</td>
      <td style="font-weight:600; color:#1e293b;">${m.name}</td>
      <td style="text-align:center; font-family:monospace; font-size:12px;">${m.height} × ${m.width} × ${m.depth}</td>
      <td style="font-size:12px; color:#475569;">${m.description || 'Корпусной модуль'}</td>
      <td style="text-align:right; font-weight:700; color:#0284c7; white-space:nowrap;">${m.basePrice.toLocaleString('ru-RU')} ₽</td>
    </tr>
  `).join('');

  const renderMaterialCards = () => materials.map(mat => `
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 14px; margin-bottom:8px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <span style="font-weight:700; color:#0f172a; font-size:13px;">${mat.name}</span>
        <span style="background:#e0f2fe; color:#0284c7; font-size:11px; font-weight:700; padding:2px 8px; border-radius:12px;">
          ${mat.multiplier > 1 ? `+${Math.round((mat.multiplier - 1) * 100)}%` : 'Базовый'}
        </span>
      </div>
      <div style="font-size:11px; color:#64748b;">${mat.description}</div>
    </div>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Каталог модулей — ${company.name}</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 15mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      line-height: 1.4;
      font-size: 13px;
      margin: 0;
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 14px;
      margin-bottom: 20px;
    }
    .logo-badge {
      font-size: 24px;
      font-weight: 800;
      color: #0284c7;
      letter-spacing: -0.5px;
    }
    .subtitle {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }
    .contacts-box {
      text-align: right;
      font-size: 11px;
      color: #334155;
      line-height: 1.5;
    }
    h2 {
      font-size: 15px;
      color: #0f172a;
      border-left: 4px solid #0284c7;
      padding-left: 8px;
      margin: 18px 0 10px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 12px;
    }
    th {
      background: #f1f5f9;
      color: #475569;
      text-align: left;
      padding: 8px 10px;
      font-weight: 700;
      border-bottom: 1px solid #cbd5e1;
    }
    td {
      padding: 7px 10px;
      border-bottom: 1px solid #f1f5f9;
    }
    tr:nth-child(even) { background-color: #fafafa; }
    .print-bar {
      background: #0f172a;
      color: white;
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .print-btn {
      background: #0284c7;
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;
    }
    @media print {
      .print-bar { display: none !important; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <div><strong>Официальный оптовый каталог модулей</strong> — Для партнёров фабрики</div>
    <button class="print-btn" onclick="window.print()">Сохранить в PDF / Распечатать</button>
  </div>

  <div class="header">
    <div>
      <div class="logo-badge">⚡ ${company.name}</div>
      <div class="subtitle">${company.brandTitle}</div>
      <div style="font-size:11px; color:#475569; margin-top:4px;">Производство: ${company.address}</div>
    </div>
    <div class="contacts-box">
      <div><strong>Телефон:</strong> ${company.phone}</div>
      <div><strong>Отдел партнёров:</strong> ${company.email}</div>
      <div><strong>Режим работы:</strong> ${company.workHours}</div>
      <div style="color:#0284c7; font-weight:600; margin-top:3px;">Цены действуют для зарегистрированных партнёров</div>
    </div>
  </div>

  <h2>1. Верхние навесные модули (H=720 / 360 мм, D=320 мм)</h2>
  <table>
    <thead>
      <tr>
        <th style="width:30px; text-align:center;">№</th>
        <th style="width:90px;">Артикул</th>
        <th>Наименование</th>
        <th style="width:110px; text-align:center;">В × Ш × Г (мм)</th>
        <th>Описание и комплектация</th>
        <th style="width:95px; text-align:right;">Базовая цена</th>
      </tr>
    </thead>
    <tbody>${renderModuleRows(upperModules)}</tbody>
  </table>

  <h2>2. Нижние напольные модули (H=820 мм, D=560 мм)</h2>
  <table>
    <thead>
      <tr>
        <th style="width:30px; text-align:center;">№</th>
        <th style="width:90px;">Артикул</th>
        <th>Наименование</th>
        <th style="width:110px; text-align:center;">В × Ш × Г (мм)</th>
        <th>Описание и комплектация</th>
        <th style="width:95px; text-align:right;">Базовая цена</th>
      </tr>
    </thead>
    <tbody>${renderModuleRows(lowerModules)}</tbody>
  </table>

  <h2>3. Пеналы и колонны (H=2040 мм, D=560 мм)</h2>
  <table>
    <thead>
      <tr>
        <th style="width:30px; text-align:center;">№</th>
        <th style="width:90px;">Артикул</th>
        <th>Наименование</th>
        <th style="width:110px; text-align:center;">В × Ш × Г (мм)</th>
        <th>Описание и комплектация</th>
        <th style="width:95px; text-align:right;">Базовая цена</th>
      </tr>
    </thead>
    <tbody>${renderModuleRows(tallModules)}</tbody>
  </table>

  <h2>4. Доступные материалы фасадов и наценки</h2>
  <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:20px;">
    ${renderMaterialCards()}
  </div>

  <div style="background:#f1f5f9; padding:12px; border-radius:8px; font-size:11px; color:#475569; border-left:4px solid #10b981;">
    <strong>Информация для заказа:</strong> Все модули поставляются в плоской упаковке с заводской PUR-кромкой, сквозной присадкой под эксцентрики и петли, а также паспортом изделия. Заказ формируется через онлайн-бланк в личном кабинете.
  </div>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
