import Image from "next/image";
import { FOTOS, type NomeFoto } from "@/lib/fotos";

/**
 * Foto do banco, sempre preenchendo o pai.
 *
 * O pai precisa ser `relative` e ter altura (aspect-[…] ou inset-0). O fundo
 * `bg-papel-2` evita o buraco branco enquanto a imagem carrega — em conexão
 * ruim isso é a diferença entre "carregando" e "quebrado".
 */
export function Foto({
  nome,
  alt,
  sizes = "100vw",
  prioritaria = false,
  className = "",
  posicao,
}: {
  nome: NomeFoto;
  /** sobrescreve o alt do registro quando o contexto pede outro texto */
  alt?: string;
  sizes?: string;
  /**
   * Acima da dobra. Sai do lazy e ganha prioridade de rede.
   *
   * A doc do Next 16 desaconselha `preload` quando mais de uma imagem pode ser
   * o LCP dependendo da viewport (é o caso de toda grade de produto); nesses
   * casos o recomendado é `loading="eager"` + `fetchPriority`.
   */
  prioritaria?: boolean;
  className?: string;
  /** object-position, quando o corte padrão corta o assunto errado */
  posicao?: string;
}) {
  const foto = FOTOS[nome];
  return (
    <Image
      src={foto.src}
      alt={alt ?? foto.alt}
      fill
      sizes={sizes}
      loading={prioritaria ? "eager" : "lazy"}
      fetchPriority={prioritaria ? "high" : "auto"}
      className={`object-cover ${className}`}
      style={posicao ? { objectPosition: posicao } : undefined}
    />
  );
}
