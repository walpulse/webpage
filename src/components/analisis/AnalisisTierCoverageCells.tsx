import { serviceTierIds, type ServiceTierId } from "@/lib/serviceTiers";
import { signalRowCoversTier } from "@/lib/analisisSignalSlides";

type TierLabels = {
  tierColLite: string;
  tierColStandard: string;
  tierColExpert: string;
  tierCoveredAria: string;
  tierNotCoveredAria: string;
};

function tierLabel(copy: TierLabels, tier: ServiceTierId): string {
  if (tier === "lite") return copy.tierColLite;
  if (tier === "standard") return copy.tierColStandard;
  return copy.tierColExpert;
}

function ariaFor(
  template: string,
  tierName: string,
): string {
  return template.replace("{tier}", tierName);
}

/** Table header cells for Básica / Estándar / Experta coverage. */
export function AnalisisTierCoverageHeaders({ copy }: { copy: TierLabels }) {
  return (
    <>
      {serviceTierIds.map((tier) => (
        <th
          key={tier}
          scope="col"
          className="analisis-signals-carousel__tier-col"
        >
          {tierLabel(copy, tier)}
        </th>
      ))}
    </>
  );
}

/** Body cells: ✓ / — per tier for one internal-signal row. */
export function AnalisisTierCoverageCells({
  rowId,
  copy,
}: {
  rowId: string;
  copy: TierLabels;
}) {
  return (
    <>
      {serviceTierIds.map((tier) => {
        const name = tierLabel(copy, tier);
        const covered = signalRowCoversTier(rowId, tier);
        return (
          <td
            key={tier}
            className={`analisis-signals-carousel__tier-col${covered ? " is-covered" : " is-missing"}`}
          >
            <span
              className="analisis-signals-carousel__tier-mark"
              aria-label={
                covered
                  ? ariaFor(copy.tierCoveredAria, name)
                  : ariaFor(copy.tierNotCoveredAria, name)
              }
            >
              {covered ? "✓" : "—"}
            </span>
          </td>
        );
      })}
    </>
  );
}
