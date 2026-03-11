// Comparison mode: same track across formulations.
// For now all formulations use the same file per track; replace with
// per-format files (e.g. /audio/ttpd/type-i/1.mp3) when available.

import { TTPD_TRACKS } from "./ttpdTracks";

export type FormulationId =
  | "type-i"
  | "type-ii"
  | "type-iii"
  | "type-iv"
  | "original";

export const COMPARISON_FORMULATIONS: { id: FormulationId; label: string }[] = [
  { id: "type-i", label: "Type I" },
  { id: "type-ii", label: "Type II" },
  { id: "type-iii", label: "Type III" },
  { id: "type-iv", label: "Type IV" },
  { id: "original", label: "Original" },
];

export function getComparisonSrc(
  trackIndex: number,
  _formulation: FormulationId
): string {
  const t = TTPD_TRACKS[trackIndex];
  return t?.src ?? "/audio/ttpd/1.mp3";
}
