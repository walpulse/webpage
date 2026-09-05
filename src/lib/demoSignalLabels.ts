/**
 * Signal title labels for demo UI — ported from
 * walpulse/workers/workers/analisis_pdf/i18n.py (SIGNAL_LABELS).
 */

export type SignalLabelLocale = "es" | "en" | "pt";

type Trilingual = { es: string; en: string; pt: string };

/** Flat signal keys shown in PDF / demo carousel. */
export const SIGNAL_LABELS: Record<string, Trilingual> = {
  hhi: { es: "HHI", en: "HHI", pt: "HHI" },
  hhi_usd: { es: "HHI USD", en: "HHI USD", pt: "HHI USD" },
  unique_senders: {
    es: "Remitentes únicos",
    en: "Unique senders",
    pt: "Remetentes únicos",
  },
  unique_senders_sum: {
    es: "Remitentes únicos (suma)",
    en: "Unique senders (sum)",
    pt: "Remetentes únicos (soma)",
  },
  unique_counterparties: {
    es: "Contrapartes únicas",
    en: "Unique counterparties",
    pt: "Contrapartes únicas",
  },
  unique_counterparties_sum: {
    es: "Contrapartes únicas (suma)",
    en: "Unique counterparties (sum)",
    pt: "Contrapartes únicas (soma)",
  },
  counterparty_hhi: {
    es: "HHI de contrapartes",
    en: "Counterparty HHI",
    pt: "HHI de contrapartes",
  },
  priced_coverage_pct: {
    es: "Cobertura de pricing",
    en: "Priced coverage",
    pt: "Cobertura de pricing",
  },
  sanctions_hit: {
    es: "Exposición a sanciones",
    en: "Sanctions exposure",
    pt: "Exposição a sanções",
  },
  sanctions_hit_any: {
    es: "Exposición a sanciones (cualquier)",
    en: "Sanctions exposure (any)",
    pt: "Exposição a sanções (qualquer)",
  },
  mixing_risk: {
    es: "Riesgo de mixing",
    en: "Mixing risk",
    pt: "Risco de mixing",
  },
  sourcify_verified_pct: {
    es: "Sourcify verificado",
    en: "Sourcify verified",
    pt: "Sourcify verificado",
  },
  kleros_tagged_counterparty_pct: {
    es: "Contrapartes etiquetadas Kleros",
    en: "Kleros-tagged counterparties",
    pt: "Contrapartes etiquetadas Kleros",
  },
  spellbook_labeled_pct: {
    es: "Etiquetado Spellbook",
    en: "Spellbook labeled",
    pt: "Etiquetado Spellbook",
  },
  unverified_contract_pct: {
    es: "Contratos no verificados",
    en: "Unverified contracts",
    pt: "Contratos não verificados",
  },
  unverified_token_exposure_pct: {
    es: "Exposición a tokens no verificados",
    en: "Unverified token exposure",
    pt: "Exposição a tokens não verificados",
  },
  active_chains_30d: {
    es: "Chains activas (30d)",
    en: "Active chains (30d)",
    pt: "Chains ativas (30d)",
  },
  active_chains_90d: {
    es: "Chains activas (90d)",
    en: "Active chains (90d)",
    pt: "Chains ativas (90d)",
  },
  total_chains_with_activity: {
    es: "Chains con actividad",
    en: "Chains with activity",
    pt: "Chains com atividade",
  },
  activity_span_days: {
    es: "Span de actividad (días)",
    en: "Activity span (days)",
    pt: "Span de atividade (dias)",
  },
  dormant_ratio: {
    es: "Ratio de dormidas",
    en: "Dormant ratio",
    pt: "Razão de dormidas",
  },
  footprint_span_hhi: {
    es: "HHI de footprint",
    en: "Footprint HHI",
    pt: "HHI de footprint",
  },
  recency_days: {
    es: "Recencia (días)",
    en: "Recency (days)",
    pt: "Recência (dias)",
  },
  consistency: {
    es: "Consistencia",
    en: "Consistency",
    pt: "Consistência",
  },
  wash_score: {
    es: "Puntaje wash",
    en: "Wash score",
    pt: "Pontuação wash",
  },
  bot_like_score: {
    es: "Puntaje bot-like",
    en: "Bot-like score",
    pt: "Pontuação bot-like",
  },
  ofac_exposure_pct_value: {
    es: "Exposición OFAC (% valor)",
    en: "OFAC exposure (% value)",
    pt: "Exposição OFAC (% valor)",
  },
  mixer_exposure_pct_value: {
    es: "Exposición mixer (% valor)",
    en: "Mixer exposure (% value)",
    pt: "Exposição mixer (% valor)",
  },
  bridge_exposure_pct_value: {
    es: "Exposición bridge (% valor)",
    en: "Bridge exposure (% value)",
    pt: "Exposição bridge (% valor)",
  },
  airdrop_exposure_pct_value: {
    es: "Exposición airdrop (% valor)",
    en: "Airdrop exposure (% value)",
    pt: "Exposição airdrop (% valor)",
  },
  protocol_exposure_pct_value: {
    es: "Exposición protocolo (% valor)",
    en: "Protocol exposure (% value)",
    pt: "Exposição protocolo (% valor)",
  },
  protocol_exposure_count: {
    es: "Exposiciones a protocolos (conteo)",
    en: "Protocol exposures (count)",
    pt: "Exposições a protocolos (contagem)",
  },
  organic_vs_synthetic: {
    es: "Orgánico vs sintético",
    en: "Organic vs synthetic",
    pt: "Orgânico vs sintético",
  },
  direct_exposure: {
    es: "Exposición directa",
    en: "Direct exposure",
    pt: "Exposição direta",
  },
  concentration: {
    es: "Concentración",
    en: "Concentration",
    pt: "Concentração",
  },
  window_days: {
    es: "Ventana (días)",
    en: "Window (days)",
    pt: "Janela (dias)",
  },
  contract_interactions_total: {
    es: "Interacciones con contratos",
    en: "Contract interactions",
    pt: "Interações com contratos",
  },
  chains_ok: {
    es: "Chains OK",
    en: "Chains OK",
    pt: "Chains OK",
  },
  credible_value_usd: {
    es: "Valor credible (USD)",
    en: "Credible value (USD)",
    pt: "Valor credible (USD)",
  },
  usable_value_usd: {
    es: "Valor usable (USD)",
    en: "Usable value (USD)",
    pt: "Valor utilizável (USD)",
  },
  total_value_usd: {
    es: "Valor total (USD)",
    en: "Total value (USD)",
    pt: "Valor total (USD)",
  },
  total_value_usd_credible: {
    es: "Valor total credible (USD)",
    en: "Total credible value (USD)",
    pt: "Valor total credible (USD)",
  },
  liquid_ratio: {
    es: "Ratio líquido",
    en: "Liquid ratio",
    pt: "Razão líquida",
  },
  liquid_usd: {
    es: "Valor líquido (USD)",
    en: "Liquid value (USD)",
    pt: "Valor líquido (USD)",
  },
  locked_usd: {
    es: "Valor bloqueado (USD)",
    en: "Locked value (USD)",
    pt: "Valor bloqueado (USD)",
  },
  locked_commitment_score: {
    es: "Puntaje de compromiso bloqueado",
    en: "Locked commitment score",
    pt: "Pontuação de compromisso bloqueado",
  },
  holdings_hhi: {
    es: "HHI de holdings",
    en: "Holdings HHI",
    pt: "HHI de holdings",
  },
  dust_pct: { es: "Dust", en: "Dust", pt: "Dust" },
  dust_count: {
    es: "Posiciones dust (conteo)",
    en: "Dust positions (count)",
    pt: "Posições dust (contagem)",
  },
  dust_ratio: {
    es: "Ratio dust",
    en: "Dust ratio",
    pt: "Razão dust",
  },
  spam_count: {
    es: "Posiciones spam (conteo)",
    en: "Spam positions (count)",
    pt: "Posições spam (contagem)",
  },
  effective_positions: {
    es: "Posiciones efectivas",
    en: "Effective positions",
    pt: "Posições efetivas",
  },
  positions_sampled: {
    es: "Posiciones muestreadas",
    en: "Positions sampled",
    pt: "Posições amostradas",
  },
  native_gas_buffer_usd: {
    es: "Buffer de gas nativo (USD)",
    en: "Native gas buffer (USD)",
    pt: "Buffer de gas nativo (USD)",
  },
  native_gas_buffer_positions: {
    es: "Posiciones buffer de gas",
    en: "Gas buffer positions",
    pt: "Posições buffer de gas",
  },
  core_ecosystems: {
    es: "Ecosistemas core",
    en: "Core ecosystems",
    pt: "Ecossistemas core",
  },
  main_chains: {
    es: "Chains principales",
    en: "Main chains",
    pt: "Chains principais",
  },
  defi_lp_split: {
    es: "Split DeFi / LP",
    en: "DeFi / LP split",
    pt: "Split DeFi / LP",
  },
  longevity_flags: {
    es: "Flags de longevidad",
    en: "Longevity flags",
    pt: "Flags de longevidade",
  },
  shares: {
    es: "Participaciones",
    en: "Shares",
    pt: "Participações",
  },
  version: {
    es: "Versión",
    en: "Version",
    pt: "Versão",
  },
  grade: {
    es: "Grade (señal)",
    en: "Grade (signal)",
    pt: "Grade (sinal)",
  },
};

function normalizeLocale(locale: string): SignalLabelLocale {
  const raw = locale.trim().toLowerCase().slice(0, 2);
  if (raw === "en" || raw === "pt") return raw;
  return "es";
}

/** Resolve a flat signal key to a localized title (PDF `signal_label` parity). */
export function signalLabel(key: string, locale: string): string {
  const lang = normalizeLocale(locale);
  const block = SIGNAL_LABELS[key];
  if (!block) {
    return key.replace(/_/g, " ").trim();
  }
  return block[lang] || block.es || key;
}
