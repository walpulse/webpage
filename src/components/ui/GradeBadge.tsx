type Props = {
  grade: string;
  className?: string;
};

function gradeColor(grade: string) {
  const g = grade.toUpperCase();
  if (g === "A" || g === "B") return "text-grade-a border-grade-a/40 bg-grade-a/10";
  if (g === "C" || g === "D") return "text-grade-c border-grade-c/40 bg-grade-c/10";
  return "text-grade-f border-grade-f/40 bg-grade-f/10";
}

export function GradeBadge({ grade, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs font-medium ${gradeColor(grade)} ${className}`}
    >
      {grade}
    </span>
  );
}
