import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Kitten Help Kalender",
  description: "Marketing calendar for Kitten Help MTÜ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="et">
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
