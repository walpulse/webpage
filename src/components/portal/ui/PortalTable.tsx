export function PortalTable({
  tableClassName = "",
  children,
}: {
  tableClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="portal-table-wrap">
      <table className={`portal-table ${tableClassName}`}>{children}</table>
    </div>
  );
}

export function TableSkeletonRows({
  columns,
  rows = 6,
}: {
  columns: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }, (_, index) => (
        <tr key={index}>
          {Array.from({ length: columns }, (_, cell) => (
            <td key={cell}>
              <span className="portal-skeleton block h-3.5 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function TableMessageRow({
  columns,
  children,
}: {
  columns: number;
  children: React.ReactNode;
}) {
  return (
    <tr>
      <td colSpan={columns} className="py-8 text-center text-sm text-muted">
        {children}
      </td>
    </tr>
  );
}

export function PortalPagination({
  info,
  prevLabel,
  nextLabel,
  onPrev,
  onNext,
  canPrev,
  canNext,
}: {
  info?: React.ReactNode;
  prevLabel: string;
  nextLabel: string;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!canPrev}
          onClick={onPrev}
          className="portal-btn portal-btn--ghost portal-btn--sm"
        >
          {prevLabel}
        </button>
        <button
          type="button"
          disabled={!canNext}
          onClick={onNext}
          className="portal-btn portal-btn--ghost portal-btn--sm"
        >
          {nextLabel}
        </button>
      </div>
      {info ? <p className="text-xs text-muted">{info}</p> : null}
    </div>
  );
}
