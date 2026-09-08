import type { AnalisisCustodyCopy } from "@/lib/analisisSignalSlides";

type Props = {
  copy: AnalisisCustodyCopy;
};

/** Static table for root-level custody signal (not a carousel tab). */
export function AnalisisCustodyBlock({ copy }: Props) {
  return (
    <div className="analisis-signals-carousel">
      <div className="analisis-signals-carousel__panel">
        <div className="analisis-signals-carousel__panel-glow" aria-hidden />
        <div className="analisis-signals-carousel__panel-head">
          <h3 className="analisis-signals-carousel__title">{copy.title}</h3>
          <p className="analisis-signals-carousel__lead">{copy.lead}</p>
        </div>

        <div className="analisis-signals-carousel__table-wrap">
          <table className="analisis-signals-carousel__table">
            <thead>
              <tr>
                <th scope="col">{copy.nameCol}</th>
                <th scope="col">{copy.meaningCol}</th>
              </tr>
            </thead>
            <tbody>
              {copy.rows.map((row, rowIndex) => (
                <tr key={row.name}>
                  <td>
                    <span className="analisis-signals-carousel__row-index">
                      {String(rowIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="analisis-signals-carousel__row-name">
                      {row.name}
                    </span>
                  </td>
                  <td>{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
