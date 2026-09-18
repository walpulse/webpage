export type MiUsuario = {
  usuario_id: string;
  cliente_id: string;
  cliente_nombre: string;
  cliente_activado: boolean;
  es_operador_sistema: boolean;
  email: string;
  nombre: string | null;
  rol: string;
  activado: boolean;
  created_at: string;
};

export type AcceptInvitacionResult = {
  usuario_id: string;
  cliente_id: string;
  cliente_nombre: string;
  email: string;
  nombre: string | null;
  rol: string;
  activado: boolean;
  idempotent: boolean;
};

export type AdminCliente = {
  id: string;
  nombre: string;
  pais: string | null;
  activado: boolean;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
  es_operador_sistema: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminInvitacion = {
  id: string;
  cliente_id: string;
  cliente_nombre: string;
  email: string;
  expires_at: string;
  accepted_at: string | null;
  accepted_user_id: string | null;
  revoked_at: string | null;
  created_at: string;
  created_by: string | null;
  status: "pending" | "accepted" | "revoked" | "expired";
};

export type AdminApiKey = {
  id: string;
  cliente_id: string;
  key_prefix: string;
  label: string | null;
  activado: boolean;
  created_at: string;
  revoked_at: string | null;
};

export type AdminAnalisisRequest = {
  id: string;
  cliente_id: string;
  cliente_nombre: string;
  tier: "basica" | "estandar" | "experta" | string;
  wallet: string;
  status: string;
  idioma: "es" | "en" | "pt" | string;
  email: string | null;
  email_sent_at: string | null;
  onchain_updated_at: string | null;
  created_at: string;
};

export type AdminAnalisisListResult = {
  rows: AdminAnalisisRequest[];
  total: number;
  limit: number;
  offset: number;
};

export type AdminAnalisisDetail = AdminAnalisisRequest & {
  api_key_id: string | null;
  function_slug: string | null;
  grade: string | null;
  grade_label: string | null;
  data_hash: string | null;
  analyzed_at: string | null;
  request_payload: unknown;
  analisis: unknown;
  evidencia: unknown;
  manifiesto: unknown;
  analisis_cid: string | null;
  evidencia_cid: string | null;
  pdf_cid: string | null;
  riesgo: unknown;
  riesgo_cid: string | null;
  riesgo_evaluado_at: string | null;
  error_message: string | null;
  onchain: unknown;
  signature: unknown;
  onchain_tx_hash: string | null;
  access_channel: string | null;
  marketplace: string | null;
  billing: string | null;
  receipt: unknown;
  upstream_errors: unknown;
  compliance_screen: unknown;
  email_message_id: string | null;
  claimed_at: string | null;
  run_progress: unknown;
  client_ip: string | null;
};

export type PortalKpiVentana = "7d" | "30d" | "total";

/**
 * Columnas comunes a `mv_cliente_analisis_kpis` y `mv_analisis_kpis_globales`:
 * las dos MVs usan los mismos nombres, así que la UI las renderiza igual.
 */
export type PortalKpisMetrics = {
  refrescado_at: string;
  ventana: PortalKpiVentana | string;

  total_analisis: number;
  analisis_basica: number;
  analisis_estandar: number;
  analisis_experta: number;
  wallets_unicas: number;
  canal_direct: number;
  canal_api: number;
  analisis_por_idioma: Record<string, number>;

  ok: number;
  ok_con_warnings: number;
  fallidos: number;
  en_curso: number;
  cancelados: number;
  tasa_exito_pct: number | null;
  con_pdf: number;
  con_onchain: number;

  latencia_p50_seg: number | null;
  latencia_p95_seg: number | null;

  grades_sintesis: Record<string, number>;
  grade_predominante: string | null;
  grades_modulos: Record<string, Record<string, number>>;
  custody_classes: Record<string, number>;

  screens_ok: number;
  screens_error: number;
  sancionadas: number;
  con_list_match: number;

  primer_analisis_at: string | null;
  ultimo_analisis_at: string | null;
  dias_desde_ultimo_analisis: number | null;
};

/** Fila de `walpulse.mv_cliente_analisis_kpis` (una por cliente y ventana). */
export type PortalKpisRow = PortalKpisMetrics & {
  cliente_id: string;
  cliente_nombre: string;
  cliente_activado: boolean;
};

/** Fila de `walpulse.mv_analisis_kpis_globales` (una por ventana, todos los clientes). */
export type PortalKpisGlobalRow = PortalKpisMetrics & {
  clientes_total: number;
  clientes_activos: number;
  clientes_con_analisis: number;
};

export type PortalKpisResult = {
  refrescado_at: string | null;
  rows: PortalKpisRow[];
};

export type PortalKpisGlobalResult = {
  refrescado_at: string | null;
  rows: PortalKpisGlobalRow[];
};

/** `admin_list_cliente_kpis` devuelve una sola ventana por llamada. */
export type AdminClienteKpisResult = {
  ventana: string;
  refrescado_at: string | null;
  rows: PortalKpisRow[];
};

/* -------------------------------------------------------------------------
 * Motor de Riesgos (`walpulse.senales` / `riesgo_matrices` / `..._versiones`
 * / `riesgo_reglas`). Los literales espejan los check constraints de la base.
 * ---------------------------------------------------------------------- */

export type SenalModulo =
  | "origins"
  | "activity"
  | "multichain"
  | "portfolio"
  | "custody"
  | "compliance";

export type SenalValueType =
  | "number"
  | "percent"
  | "boolean"
  | "grade"
  | "enum"
  | "string"
  | "object";

export type RiesgoOperador =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "between"
  | "in"
  | "not_in"
  | "is_true"
  | "is_false"
  | "is_null"
  | "not_null";

export type RiesgoEfectoTipo = "puntos";

/** Puntos de riesgo que suma la regla dentro del presupuesto de 100. */
export type RiesgoEfecto = {
  tipo: RiesgoEfectoTipo;
  valor: number;
};

/** `{"value":0.5}` | `{"min":0,"max":1}` | `{"values":["hosted_known"]}` */
export type RiesgoUmbral = {
  value?: number | string;
  min?: number;
  max?: number;
  values?: (number | string)[];
};

/** Catálogo plataforma. `labels` y `descripcion` usan claves `esp`/`eng`/`por`. */
export type Senal = {
  id: string;
  codigo: string;
  modulo: SenalModulo | string;
  signal_key: string;
  json_path: string;
  value_type: SenalValueType | string;
  tiers: string[];
  agregacion: string;
  labels: Record<string, string>;
  /** Qué calcula la señal, por idioma (`esp` / `eng` / `por`). */
  descripcion: Record<string, string>;
  /** Cómo usarla en una regla, por idioma (`esp` / `eng` / `por`). */
  uso_sugerido: Record<string, string>;
  metadata: { enum?: string[]; min?: number; max?: number; nota?: string };
  habilitada: boolean;
};

/**
 * `publicado` es la única versión vigente de la matriz; al publicar la
 * siguiente, la anterior pasa a `archivado` y queda como histórico inmutable.
 */
export type RiesgoMatrizVersionEstado =
  | "borrador"
  | "publicado"
  | "archivado";

export type RiesgoMatrizVersion = {
  id: string;
  matriz_id: string;
  version_num: number;
  estado: RiesgoMatrizVersionEstado | string;
  /** Etiqueta humana opcional; version_num sigue siendo la identidad. */
  nombre: string | null;
  /** Notas libres del usuario. */
  notas: string | null;
  /** Procedencia automática al copiar entre matrices (no editable). */
  origen_copia: string | null;
  created_by: string | null;
  publicado_at: string | null;
  frozen_at: string | null;
  created_at: string;
  updated_at: string;
  reglas_count: number;
  /** Suma de los puntos de las reglas habilitadas (presupuesto 0-100). */
  puntos_asignados: number;
};

export type RiesgoMatriz = {
  id: string;
  cliente_id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  activado: boolean;
  version_produccion_id: string | null;
  created_at: string;
  updated_at: string;
  versiones: RiesgoMatrizVersion[];
};

export type RiesgoRegla = {
  id: string;
  matriz_version_id: string;
  senal_id: string;
  codigo: string;
  nombre: string;
  habilitada: boolean;
  orden: number;
  operador: RiesgoOperador | string;
  umbral: RiesgoUmbral;
  efecto: RiesgoEfecto;
  params: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  senal: Senal | null;
};

/** El puntero de sandbox vive en `clientes`, por eso viaja junto a las matrices. */
export type RiesgoMatricesResult = {
  sandbox_version_id: string | null;
  rows: RiesgoMatriz[];
};

export type RiesgoMatrizResult = {
  sandbox_version_id: string | null;
  matriz: RiesgoMatriz;
};

export type AdminAnalisisRunStage = {
  id: string;
  request_id: string;
  stage: string;
  status: string;
  started_at: string;
  finished_at: string | null;
  duration_ms: number | null;
  error_message: string | null;
  meta: unknown;
};
