import type {
  RiesgoOperador,
  RiesgoRegla,
  Senal,
  SenalModulo,
  SenalValueType,
} from "@/lib/portal/types";

/**
 * Ids canónicos del Motor de Riesgos, espejo de los check constraints de
 * `walpulse.riesgo_reglas` y del seed de `walpulse.senales` (solo etiquetas).
 */
export const SENAL_MODULOS = [
  "origins",
  "activity",
  "multichain",
  "portfolio",
  "custody",
  "compliance",
] as const;

export const RIESGO_OPERADORES = [
  "eq",
  "neq",
  "gt",
  "gte",
  "lt",
  "lte",
  "between",
  "in",
  "not_in",
  "is_true",
  "is_false",
  "is_null",
  "not_null",
] as const;

/**
 * Presupuesto de una versión: sus reglas habilitadas suman como mucho 100 y
 * publicar exige exactamente 100. Espejo del trigger
 * `trg_riesgo_reglas_presupuesto` y de `portal_publish_riesgo_matriz_version`.
 */
export const RIESGO_PUNTOS_MAX = 100;

export function puntosAsignados(reglas: RiesgoRegla[]): number {
  return reglas.reduce(
    (total, regla) =>
      regla.habilitada ? total + (regla.efecto?.valor ?? 0) : total,
    0,
  );
}

/**
 * Puntos que quedan libres. Al editar una regla, los suyos no cuentan: si no,
 * cambiar el umbral de la regla que completa el 100 sería imposible.
 */
export function puntosLibres(
  reglas: RiesgoRegla[],
  enEdicion?: RiesgoRegla | null,
): number {
  const propios =
    enEdicion && enEdicion.habilitada ? (enEdicion.efecto?.valor ?? 0) : 0;
  return RIESGO_PUNTOS_MAX - puntosAsignados(reglas) + propios;
}

export const SENAL_VALUE_TYPES = [
  "number",
  "percent",
  "boolean",
  "grade",
  "enum",
  "string",
  "object",
] as const;

export function isKnownModulo(modulo: string): modulo is SenalModulo {
  return (SENAL_MODULOS as readonly string[]).includes(modulo);
}

export function isKnownValueType(tipo: string): tipo is SenalValueType {
  return (SENAL_VALUE_TYPES as readonly string[]).includes(tipo);
}

export function isKnownOperador(operador: string): operador is RiesgoOperador {
  return (RIESGO_OPERADORES as readonly string[]).includes(operador);
}

/** El seed guarda las etiquetas con claves `esp` / `eng` / `por`. */
const LOCALE_KEY: Record<string, string> = { es: "esp", en: "eng", pt: "por" };

export function senalLabel(senal: Senal, locale: string): string {
  const key = LOCALE_KEY[locale] ?? "esp";
  return senal.labels?.[key] || senal.labels?.esp || senal.codigo;
}

/**
 * Texto de negocio de una señal (`descripcion` = qué calcula, `uso_sugerido` =
 * cómo usarla). Cae al español y devuelve null si la señal todavía no tiene
 * redacción, para que la UI muestre el faltante en lugar de una tarjeta vacía.
 */
export function senalTexto(
  senal: Senal,
  locale: string,
  campo: "descripcion" | "uso_sugerido",
): string | null {
  const key = LOCALE_KEY[locale] ?? "esp";
  const textos = senal[campo];
  return textos?.[key] || textos?.esp || null;
}

/**
 * Operadores que tienen sentido para cada tipo de valor. Evita reglas
 * imposibles (un `gt` sobre un booleano) que la base aceptaría igual.
 */
const OPERADORES_POR_TIPO: Record<SenalValueType, readonly RiesgoOperador[]> = {
  number: ["gt", "gte", "lt", "lte", "between", "eq", "neq"],
  percent: ["gt", "gte", "lt", "lte", "between", "eq", "neq"],
  boolean: ["is_true", "is_false"],
  enum: ["in", "not_in", "eq", "neq"],
  grade: ["in", "not_in", "eq", "neq"],
  string: ["eq", "neq", "in"],
  object: ["is_null", "not_null"],
};

const SIEMPRE: readonly RiesgoOperador[] = ["is_null", "not_null"];

export function operadoresParaValueType(
  valueType: string,
): readonly RiesgoOperador[] {
  const base = OPERADORES_POR_TIPO[valueType as SenalValueType];
  if (!base) return RIESGO_OPERADORES;
  if (valueType === "object" || valueType === "boolean") return base;
  return [...base, ...SIEMPRE];
}

/** Forma del umbral que pide cada operador. */
export type UmbralShape = "none" | "single" | "range" | "list";

export function umbralShape(operador: string): UmbralShape {
  if (["is_true", "is_false", "is_null", "not_null"].includes(operador)) {
    return "none";
  }
  if (operador === "between") return "range";
  if (operador === "in" || operador === "not_in") return "list";
  return "single";
}

/** Valores sugeridos para `in` / `not_in` cuando el seed los trae. */
export function valoresSugeridos(senal: Senal | null): string[] {
  return senal?.metadata?.enum ?? [];
}
