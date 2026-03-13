"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { analyzeAudioFromUrl, type AnalysisResult } from "@/lib/audioAnalysis";
import {
  getComparisonSrc,
  COMPARISON_FORMULATIONS,
  type FormulationId,
} from "@/lib/comparisonSources";

const ANALYSIS_TYPES = [
  { id: "waveform", label: "Waveform" },
  { id: "spectrum", label: "Frequency Spectrum" },
] as const;

type AnalysisTypeId = (typeof ANALYSIS_TYPES)[number]["id"];

const LINE_COLORS: Record<FormulationId, string> = {
  "type-i": "rgba(232, 230, 227, 0.55)",
  "type-ii": "rgba(232, 230, 227, 0.65)",
  "type-iii": "rgba(232, 230, 227, 0.75)",
  "type-iv": "rgba(232, 230, 227, 0.85)",
  original: "rgba(232, 230, 227, 0.95)",
};
const ACTIVE_LINE_COLOR = "#e8e6e3";

type Props = {
  trackIndex: number;
  formulation: FormulationId;
  trackTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onFormulationChange?: (id: FormulationId) => void;
};

export function AudioAnalysisPanel({
  trackIndex,
  formulation,
  trackTitle,
  isOpen,
  onClose,
  onFormulationChange,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [analysisType, setAnalysisType] = useState<AnalysisTypeId>("waveform");
  const [dataByFormulation, setDataByFormulation] = useState<
    Record<FormulationId, AnalysisResult | null>
  >({} as Record<FormulationId, AnalysisResult | null>);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [graphKey, setGraphKey] = useState(0);

  const loadAllAnalyses = useCallback(async () => {
    setLoading(true);
    setError(null);
    setDataByFormulation({} as Record<FormulationId, AnalysisResult | null>);
    try {
      const entries: [FormulationId, AnalysisResult][] = [];
      for (const f of COMPARISON_FORMULATIONS) {
        const url = getComparisonSrc(trackIndex, f.id);
        const result = await analyzeAudioFromUrl(url);
        entries.push([f.id, result]);
      }
      const next = {} as Record<FormulationId, AnalysisResult | null>;
      entries.forEach(([id, result]) => {
        next[id] = result;
      });
      setDataByFormulation(next);
      setGraphKey((k) => k + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }, [trackIndex]);

  useEffect(() => {
    if (!isOpen) return;
    loadAllAnalyses();
  }, [isOpen, loadAllAnalyses]);

  useEffect(() => {
    if (!isOpen) return;
    document.documentElement.classList.add("lock-scroll");
    return () => document.documentElement.classList.remove("lock-scroll");
  }, [isOpen]);

  const hasData = COMPARISON_FORMULATIONS.some((f) => dataByFormulation[f.id] != null);
  const refResult = COMPARISON_FORMULATIONS.find((f) => dataByFormulation[f.id] != null);

  useEffect(() => {
    if (!hasData || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    const w = Math.floor(rect.width * dpr);
    const h = Math.floor(rect.height * dpr);
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    const cw = rect.width;
    const ch = rect.height;
    const leftPad = 40;
    const bottomPad = 28;
    const rightPad = 10;
    const topPad = 10;
    const width = cw - leftPad - rightPad;
    const height = ch - topPad - bottomPad;

    const drawAxisLabels = (xLabel: string, yLabel: string) => {
      ctx.save();
      ctx.fillStyle = "#9f9f9f";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(xLabel, leftPad + width / 2, ch - 6);
      ctx.save();
      ctx.translate(12, topPad + height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "center";
      ctx.fillText(yLabel, 0, 0);
      ctx.restore();
      ctx.restore();
    };

    if (analysisType === "waveform") {
      ctx.clearRect(0, 0, cw, ch);
      const midY = topPad + height / 2;
      const len = refResult ? dataByFormulation[refResult.id]!.waveform.length : 0;
      if (len > 0) {
        COMPARISON_FORMULATIONS.forEach((f) => {
          const d = dataByFormulation[f.id];
          if (!d || d.waveform.length === 0) return;
          const isActive = f.id === formulation;
          ctx.strokeStyle = isActive ? ACTIVE_LINE_COLOR : LINE_COLORS[f.id];
          ctx.lineWidth = isActive ? 2.5 : 1;
          ctx.beginPath();
          const pts = d.waveform;
          for (let i = 0; i < pts.length; i++) {
            const x = leftPad + (i / (pts.length - 1)) * width;
            const y = midY - pts[i] * (height / 2);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        });
      }
      drawAxisLabels("Time (s)", "Amplitude");
    } else {
      ctx.clearRect(0, 0, cw, ch);
      let globalMax = 0;
      COMPARISON_FORMULATIONS.forEach((f) => {
        const d = dataByFormulation[f.id];
        if (!d) return;
        for (let i = 0; i < d.spectrum.length; i++) {
          if (d.spectrum[i] > globalMax) globalMax = d.spectrum[i];
        }
      });
      if (globalMax <= 0) globalMax = 1;
      COMPARISON_FORMULATIONS.forEach((f) => {
        const d = dataByFormulation[f.id];
        if (!d || d.spectrum.length === 0) return;
        const isActive = f.id === formulation;
        ctx.strokeStyle = isActive ? ACTIVE_LINE_COLOR : LINE_COLORS[f.id];
        ctx.lineWidth = isActive ? 2.5 : 1;
        ctx.beginPath();
        for (let i = 0; i < d.spectrum.length; i++) {
          const x = leftPad + (i / (d.spectrum.length - 1)) * width;
          const barHeight = (d.spectrum[i] / globalMax) * height;
          const y = topPad + height - barHeight;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      drawAxisLabels("Frequency (Hz)", "Amplitude");
    }
  }, [analysisType, dataByFormulation, formulation, hasData, refResult]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10010] flex items-center justify-center bg-transparent p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[85vh] overflow-y-auto border border-[#e8e6e3]/20 bg-[#0b0b0b] p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end items-center mb-4">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#9f9f9f] hover:text-[#e8e6e3] text-3xl sm:text-4xl leading-none -mr-2"
            aria-label="Close analysis"
          >
            x
          </button>
        </div>

        <h3 className="text-lg font-heading text-[#e8e6e3] uppercase tracking-wider mb-2">
          Audio Analysis
        </h3>
        <p className="text-[#e8e6e3] font-heading text-xs uppercase tracking-widest mb-1">
          {trackTitle}
        </p>
        <p className="text-[#c8c8c8] font-serif text-sm leading-[1.6] mb-1">
          Visual comparison of the recording across different cassette tape formulations.
        </p>
        <p className="text-[#c8c8c8]/80 font-serif text-sm leading-[1.6] mb-4">
          The graphs highlight frequency response, dynamic range and noise characteristics introduced by each tape type.
        </p>

        <p className="text-[#9f9f9f] font-heading text-xs uppercase tracking-widest mb-2">
          Analysis type
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {ANALYSIS_TYPES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setAnalysisType(id)}
              className={`min-h-[40px] px-4 py-2 border font-heading text-xs uppercase tracking-widest transition-colors ${
                analysisType === id
                  ? "border-[#e8e6e3] bg-[#e8e6e3]/10 text-[#e8e6e3]"
                  : "border-[#e8e6e3]/40 text-[#9f9f9f] hover:text-[#e8e6e3]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="h-[260px] flex items-center justify-center text-[#9f9f9f] font-serif">
            Analyzing all formulations...
          </div>
        )}
        {error && (
          <div className="h-[120px] flex items-center justify-center text-[#c8c8c8] font-serif">
            {error}
          </div>
        )}
        {!loading && !error && hasData && (
          <>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-2 transition-colors duration-200">
              {COMPARISON_FORMULATIONS.map((f) => {
                const isActive = f.id === formulation;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => onFormulationChange?.(f.id)}
                    disabled={!onFormulationChange}
                    className={`font-heading text-[10px] uppercase tracking-wider transition-colors duration-200 min-h-[32px] px-1 -mx-1 rounded border border-transparent ${
                      isActive
                        ? "text-[#e8e6e3]"
                        : "text-[#9f9f9f] hover:text-[#e8e6e3] hover:border-[#e8e6e3]/30"
                    } ${!onFormulationChange ? "cursor-default" : "cursor-pointer"}`}
                  >
                    {f.label}
                    {isActive ? " (active)" : ""}
                  </button>
                );
              })}
            </div>
            <div
              key={graphKey}
              className="w-full rounded overflow-hidden border border-[#e8e6e3]/10 analysis-graph-enter"
            >
              <canvas
                ref={canvasRef}
                className="w-full h-[260px] sm:h-[320px] block"
                style={{ width: "100%", height: 320 }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
