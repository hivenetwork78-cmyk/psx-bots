import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "PSX Trading Bots",
  description: "Trading bots platform for Pakistan Stock Exchange",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
