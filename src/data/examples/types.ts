export type ReportLocale = "eng" | "esp" | "por";

export type LocalizedText = {
  eng: string;
  esp: string;
  por: string;
};

export type ReportSignal = {
  id: string;
  label: LocalizedText;
  value: string | number | boolean;
  display: LocalizedText;
};

export type ReportModule = {
  type: string;
  grade: string;
  formula_version: string;
  certificate_id: string;
  data_hash: string;
  onchain_tx_hash: string;
  summary: LocalizedText;
  strengths: LocalizedText[];
  concerns: LocalizedText[];
  signals: ReportSignal[];
};

export type WalcertReportLiteV1 = {
  _meta?: {
    source?: string;
    cid?: string;
    note?: string;
  };
  schema: string;
  wallet: string;
  analyzed_at: string;
  agent_id: string;
  chain_id: number;
  partial: boolean;
  modules: ReportModule[];
  cid: string | null;
  generated_at: string;
};

export function reportLocaleFromApp(locale: string): ReportLocale {
  if (locale === "es") return "esp";
  if (locale === "pt") return "por";
  return "eng";
}

export function truncateWallet(wallet: string): string {
  if (wallet.length < 12) return wallet;
  return `${wallet.slice(0, 6)}…${wallet.slice(-4)}`;
}

export function chainLabel(chainId: number): string {
  if (chainId === 42220) return "Celo";
  return String(chainId);
}
