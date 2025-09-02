import { Verdict } from "../api";

export default function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const cls =
    verdict === "SAFE"
      ? "badge bg-success rounded-pill"
      : verdict === "SUSPICIOUS"
      ? "badge bg-warning text-dark rounded-pill"
      : "badge bg-danger rounded-pill";
  return <span className={cls}>{verdict}</span>;
}
