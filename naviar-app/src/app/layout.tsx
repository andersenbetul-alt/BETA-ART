import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NAVIAR",
  description: "Clarity in complex systems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
