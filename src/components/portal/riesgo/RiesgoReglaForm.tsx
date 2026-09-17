"use client";

import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { PuntosBar } from "@/components/portal/riesgo/PuntosBar";
import { SenalTextos } from "@/components/portal/riesgo/SenalTextos";
import { useModuloLabel } from "@/components/portal/riesgo/useModuloLabel";
import { PortalAlert } from "@/components/portal/ui/PortalAlert";
import { PortalButton } from "@/components/portal/ui/PortalButton";
import {
  PortalCheckbox,
  PortalInput,
  PortalSelect,
} from "@/components/portal/ui/PortalField";
import { portalErrorKey } from "@/lib/portal/errors";
import {
  RIESGO_PUNTOS_MAX,
  SENAL_MODULOS,
  operadoresParaValueType,
  senalLabel,
  umbralShape,
  valoresSugeridos,
} from "@/lib/portal/riesgoLabels";
import type { RiesgoRegla, RiesgoUmbral, Senal } from "@/lib/portal/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

/**
 * Alta / edición de una regla. Los operadores se filtran por el `value_type`
 * de la señal y el umbral cambia de forma según el operador, que es lo que
 * evita mandar a la base combinaciones que nunca podrían evaluarse. Los puntos
 * se validan contra lo que queda libre del presupuesto de la versión.
 *
 * `regla` es solo prefill: con `reglaId` en null la base inserta una regla
 * nueva, que es lo que permite duplicar una existente.
 */
export function RiesgoReglaForm({
  versionId,
  senales,
  regla,
  reglaId,
  puntosLibres,
  onDone,
  onCancel,
}: {
  versionId: string;
  senales: Senal[];
  regla: RiesgoRegla | null;
  reglaId: string | null;
  puntosLibres: number;
  onDone: () => void;
  onCancel: () => void;
}) {
  const t = useTranslations("portal.riesgo");
  const te = useTranslations("portal.errors");
  const tp = useTranslations("portal");
  const locale = useLocale();
  const moduloLabel = useModuloLabel();

  const duplicando = regla != null && reglaId == null;

  const [senalId, setSenalId] = useState(regla?.senal_id ?? "");
  const [nombre, setNombre] = useState(() => {
    if (!regla) return "";
    return duplicando ? t("nombreCopia", { nombre: regla.nombre }) : regla.nombre;
  });
  const [operador, setOperador] = useState(regla?.operador ?? "");
  const [valor, setValor] = useState(String(regla?.umbral?.value ?? ""));
  const [min, setMin] = useState(String(regla?.umbral?.min ?? ""));
  const [max, setMax] = useState(String(regla?.umbral?.max ?? ""));
  const [valores, setValores] = useState<string[]>(
    (regla?.umbral?.values ?? []).map(String),
  );
  const [puntos, setPuntos] = useState(() => {
    const original = regla?.efecto?.valor;
    if (original == null) return "";
    // La copia no libera los puntos del original: se acotan al presupuesto.
    return String(duplicando ? Math.min(original, puntosLibres) : original);
  });
  const [habilitada, setHabilitada] = useState(regla?.habilitada ?? true);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  /**
   * El formulario aparece al final del panel, a veces fuera de la pantalla: sin
   * esto, el botón que lo abre parece no hacer nada. El foco va al primer campo
   * y el scroll lo acompaña, no al revés.
   */
  useEffect(() => {
    formRef.current?.querySelector("select")?.focus({ preventScroll: true });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const senal = useMemo(
    () => senales.find((item) => item.id === senalId) ?? null,
    [senales, senalId],
  );
  /**
   * Señales agrupadas por módulo. Con 133 opciones el `optgroup` es lo que hace
   * navegable la lista, y además desambigua las etiquetas que se repiten entre
   * módulos (la exposición a mixer existe en Origen y en Actividad).
   */
  const porModulo = useMemo(() => {
    const modulos = [
      ...SENAL_MODULOS,
      ...senales
        .map((item) => item.modulo)
        .filter((modulo) => !(SENAL_MODULOS as readonly string[]).includes(modulo)),
    ];
    return [...new Set(modulos)]
      .map(
        (modulo) =>
          [modulo, senales.filter((item) => item.modulo === modulo)] as const,
      )
      .filter(([, delModulo]) => delModulo.length > 0);
  }, [senales]);
  const operadores = senal
    ? operadoresParaValueType(senal.value_type)
    : ([] as readonly string[]);
  const shape = umbralShape(operador);
  const sugeridos = valoresSugeridos(senal);

  // `puntosLibres` ya descuenta los puntos de la regla en edición, así que lo
  // que suman las demás es el complemento del presupuesto.
  const puntosOtrasReglas = RIESGO_PUNTOS_MAX - puntosLibres;
  const puntosPreview = Number.isFinite(Number(puntos))
    ? Math.max(0, Number(puntos))
    : 0;

  function onSenalChange(nextId: string) {
    setSenalId(nextId);
    const next = senales.find((item) => item.id === nextId) ?? null;
    const permitidos = next ? operadoresParaValueType(next.value_type) : [];
    const nextOperador = permitidos.includes(
      operador as (typeof permitidos)[number],
    )
      ? operador
      : (permitidos[0] ?? "");
    setOperador(nextOperador);
    setValores([]);
    if (!nombre && next) setNombre(senalLabel(next, locale));
  }

  function construirUmbral(): RiesgoUmbral {
    if (shape === "none") return {};
    if (shape === "range") return { min: Number(min), max: Number(max) };
    if (shape === "list") return { values: valores };
    // Enum y string guardan el valor como texto; el resto, numérico.
    const esNumerico =
      senal?.value_type === "number" || senal?.value_type === "percent";
    return { value: esNumerico ? Number(valor) : valor };
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorKey(null);

    if (!senal || !operador) {
      setErrorKey("generic");
      return;
    }
    if (shape === "list" && valores.length === 0) {
      setErrorKey("generic");
      return;
    }

    const valorPuntos = Number(puntos);
    if (!Number.isFinite(valorPuntos) || valorPuntos < 0) {
      setErrorKey("invalid_efecto");
      return;
    }
    // El trigger de la base lo rechaza igual; acá el aviso llega sin viaje.
    if (valorPuntos > puntosLibres) {
      setErrorKey("puntos_exceden_100");
      return;
    }

    setPending(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.rpc("portal_upsert_riesgo_regla", {
        p_matriz_version_id: versionId,
        p_senal_id: senal.id,
        p_nombre: nombre.trim() || senalLabel(senal, locale),
        p_operador: operador,
        p_umbral: construirUmbral(),
        p_efecto: { tipo: "puntos", valor: valorPuntos },
        // Sin orden, el alta va al final y la edición conserva el que tenía:
        // el orden se cambia con las flechas del listado.
        p_orden: null,
        p_habilitada: habilitada,
        p_params: {},
        // Sin id la base inserta y deriva el código de la señal y el operador.
        p_regla_id: reglaId,
      });
      if (error) {
        setErrorKey(portalErrorKey(error.message));
        return;
      }
      onDone();
    } catch (err) {
      setErrorKey(
        portalErrorKey(err instanceof Error ? err.message : "generic"),
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="portal-panel portal-panel--inset mt-3 flex flex-col gap-4"
    >
      {/* Sin encabezado propio, la etiqueta del primer campo ("Señal *") se leía
          como el título de la sección. */}
      <h3 className="portal-section-title">
        {reglaId
          ? t("editarRegla")
          : duplicando
            ? t("duplicarRegla")
            : t("nuevaRegla")}
      </h3>

      <div>
        <PortalSelect
          label={`${t("fieldSenal")} *`}
          required
          value={senalId}
          onChange={(event) => onSenalChange(event.target.value)}
        >
          <option value="">{t("elegirSenal")}</option>
          {porModulo.map(([modulo, delModulo]) => (
            <optgroup key={modulo} label={moduloLabel(modulo)}>
              {delModulo.map((item) => (
                <option key={item.id} value={item.id}>
                  {senalLabel(item, locale)}
                </option>
              ))}
            </optgroup>
          ))}
        </PortalSelect>

        {/* Lo mismo que dice el catálogo: sin esto hay que salir de la pantalla
            para saber qué mide la señal que se está reglando. */}
        {senal ? (
          <SenalTextos
            senal={senal}
            className="mt-2 rounded-xl border border-glass/40 p-3.5"
          />
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <PortalSelect
          label={`${t("fieldOperador")} *`}
          required
          value={operador}
          disabled={!senal}
          hint={senal ? t("operadorHint") : undefined}
          onChange={(event) => setOperador(event.target.value)}
        >
          <option value="">{t("elegirOperador")}</option>
          {operadores.map((id) => (
            <option key={id} value={id}>
              {t(`operadores.${id}`)}
            </option>
          ))}
        </PortalSelect>

        {shape === "single" ? (
          <PortalInput
            label={`${t("fieldUmbral")} *`}
            required
            value={valor}
            onChange={(event) => setValor(event.target.value)}
          />
        ) : null}

        {shape === "range" ? (
          <div className="grid grid-cols-2 gap-3">
            <PortalInput
              label={`${t("fieldMin")} *`}
              required
              type="number"
              step="any"
              value={min}
              onChange={(event) => setMin(event.target.value)}
            />
            <PortalInput
              label={`${t("fieldMax")} *`}
              required
              type="number"
              step="any"
              value={max}
              onChange={(event) => setMax(event.target.value)}
            />
          </div>
        ) : null}

        {shape === "list" ? (
          <div className="flex flex-col gap-2">
            <span className="portal-label__text">{t("fieldValores")}</span>
            {sugeridos.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {sugeridos.map((opcion) => (
                  <PortalCheckbox
                    key={opcion}
                    label={opcion}
                    checked={valores.includes(opcion)}
                    onChange={(event) =>
                      setValores((prev) =>
                        event.target.checked
                          ? [...prev, opcion]
                          : prev.filter((value) => value !== opcion),
                      )
                    }
                  />
                ))}
              </div>
            ) : (
              <PortalInput
                label={t("fieldValoresLibres")}
                hint={t("valoresLibresHint")}
                value={valores.join(", ")}
                onChange={(event) =>
                  setValores(
                    event.target.value
                      .split(",")
                      .map((value) => value.trim())
                      .filter(Boolean),
                  )
                }
              />
            )}
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <PortalInput
          label={`${t("fieldPuntos")} *`}
          required
          type="number"
          min={0}
          max={puntosLibres}
          step="any"
          value={puntos}
          onChange={(event) => setPuntos(event.target.value)}
        />
        <PuntosBar
          asignados={puntosOtrasReglas}
          extra={habilitada ? puntosPreview : 0}
          leyenda
          className="self-end"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <PortalInput
          label={t("fieldNombreRegla")}
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
        />
        <PortalCheckbox
          label={t("fieldHabilitada")}
          checked={habilitada}
          onChange={(event) => setHabilitada(event.target.checked)}
        />
      </div>

      {errorKey ? <PortalAlert>{te(errorKey as "generic")}</PortalAlert> : null}

      <div className="flex flex-wrap items-center gap-2">
        <PortalButton type="submit" size="sm" pending={pending}>
          {pending ? tp("submitting") : t("guardarRegla")}
        </PortalButton>
        <PortalButton
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
        >
          {t("cancelar")}
        </PortalButton>
      </div>
    </form>
  );
}
