// ===================================================================
// MagnaMotion — Paleta ativa (faz parte do roteiro, junto do scenes.ts)
// "rosegold" = padrão oficial Magna (aprovado 2026-06-10)
// "gold" = dourado original com degradê (teste 2026-06-10, reprovado)
// "red" = vermelho estilo Netflix: preto + branco + vermelho, fonte
//         Bebas Neue (pedido do Allysson 2026-06-10, SÓ para esta arte)
// Trocar aqui ANTES de renderizar cada roteiro (documentar no registry).
// ===================================================================

export type PaletteId = "rosegold" | "gold" | "red";

export const ACTIVE_PALETTE: PaletteId = "red";
