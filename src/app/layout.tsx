import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";

export const metadata: Metadata = {
  title: "Laleche — Odabrano za slobodne žene",
  description:
    "Concept Laleche: kurirana selekcija ženske garderobe. Ne treba ti više odeće, treba ti bolji izbor.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
