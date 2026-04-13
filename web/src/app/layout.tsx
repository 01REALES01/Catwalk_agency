import type { Metadata } from "next";
import "./globals.css";

const googleFontsHref =
  "https://fonts.googleapis.com/css2?family=Epilogue:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap";

export const metadata: Metadata = {
  title: "Catwalk Agency",
  description: "Agencia de modelaje — el roster y el dashboard editorial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link href={googleFontsHref} rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
