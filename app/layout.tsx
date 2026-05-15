import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Property Valuation | Powered by Sellhome",
  description:
    "Get instant property valuations, market insights, and transfer history for South African properties.",
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
