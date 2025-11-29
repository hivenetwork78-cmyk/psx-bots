import "./globals.css";

export const metadata = {
  title: "PSX Trading Bots",
  description: "Trading bots platform for Pakistan Stock Exchange",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50">{children}</body>
    </html>
  );
}
