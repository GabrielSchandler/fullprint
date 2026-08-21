import Image from "next/image";
import type { Produto } from "@/lib/catalogo";

/**
 * Foto do produto.
 *
 * Traz o próprio invólucro `relative`, porque o `fill` do next/image exige pai
 * posicionado e os pontos de uso são só um quadrado com tamanho. As classes
 * passadas vão para o invólucro — então `aspect-*`, `size-full` e transform de
 * hover continuam funcionando como funcionavam com o mockup vetorial.
 *
 * ⚠️ O `next dev` avisa "LCP detectada como lazy" em algumas rotas. É falso
 * positivo: a galeria é menor que o catálogo, então a mesma foto aparece duas
 * ou três vezes na página — uma `eager` (acima da dobra) e as outras `lazy`.
 * O aviso casa por URL e encontra a lazy. Conferido no HTML servido: a
 * instância acima da dobra sai com loading="eager". Não perseguir de novo.
 */
export function FotoProduto({
  produto,
  titulo,
  className = "",
  sizes = "(max-width: 768px) 40vw, 260px",
  prioritaria = false,
}: {
  produto: Produto;
  /** sobrescreve o alt quando o contexto não é o nome do produto */
  titulo?: string;
  className?: string;
  sizes?: string;
  /**
   * Acima da dobra. Sai do lazy e ganha prioridade de rede — ver a doc do
   * next/image: `preload` só serve quando há uma única candidata a LCP.
   */
  prioritaria?: boolean;
}) {
  return (
    <span className={`relative block overflow-hidden ${className}`}>
      <Image
        src={produto.foto}
        alt={titulo ?? produto.nome}
        fill
        sizes={sizes}
        loading={prioritaria ? "eager" : "lazy"}
      fetchPriority={prioritaria ? "high" : "auto"}
        className="object-cover"
      />
    </span>
  );
}
