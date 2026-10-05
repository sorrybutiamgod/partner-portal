import "./globals.css";

export const metadata = {
  title: "Личный кабинет партнёра — Фабрика модульных систем МодульПро",
  description: "B2B-портал для мебельных салонов и дизайнеров: онлайн-бланк заказа модулей, мгновенный расчёт стоимости, автоматическое формирование счетов-фактур и Telegram-уведомления.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
