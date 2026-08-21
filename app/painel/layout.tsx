import type { Metadata } from "next";
import { Casca } from "@/components/painel/Casca";

export const metadata: Metadata = {
  title: {
    default: "Painel",
    template: "%s · Painel Full Print",
  },
  robots: { index: false, follow: false },
};

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return <Casca>{children}</Casca>;
}
