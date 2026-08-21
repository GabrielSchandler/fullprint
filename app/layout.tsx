import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--fonte-display",
});

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--fonte-sans",
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--fonte-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Full Print — Papelaria e impressão personalizada",
    template: "%s · Full Print",
  },
  description:
    "Cadernos, planners, cadernetas e papelaria feitos em gráfica própria. E, para empresas, personalização com a sua marca — do briefing à tiragem.",
  metadataBase: new URL("https://fullprintgrafica.com.br"),
};

export const viewport: Viewport = {
  themeColor: "#f6f3ee",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /* data-scroll-behavior: o CSS usa scroll-behavior: smooth, e sem este
     atributo a troca de rota rola animado em vez de saltar para o topo */
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
