import { magnitudeSpectrum } from "./fft";

// Параметры слегка уменьшены ради производительности.
// Визуально качество остаётся приемлемым, а расчёты становятся заметно легче.
const FFT_SIZE = 1024;
const SPECTRUM_HOP = 1024;
const WAVEFORM_POINTS = 900;

export type AnalysisResult = {
  waveform: Float32Array;
  spectrum: Float32Array;
  duration: number;
  sampleRate: number;
};

// Кэш по URL, чтобы не пересчитывать анализ при повторном открытии панели
const analysisCache = new Map<string, Promise<AnalysisResult>>();

export async function analyzeAudioFromUrl(url: string): Promise<AnalysisResult> {
  if (!analysisCache.has(url)) {
    const promise = (async () => {
      const res = await fetch(url);
      const arrayBuffer = await res.arrayBuffer();
      const ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const buffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
      const channel = buffer.getChannelData(0);
      const sampleRate = buffer.sampleRate;
      const duration = buffer.duration;

      const waveform = downsample(channel, WAVEFORM_POINTS);
      const spectrum = averageSpectrum(channel, FFT_SIZE, SPECTRUM_HOP);

      return { waveform, spectrum, duration, sampleRate };
    })();
    analysisCache.set(url, promise);
  }

  return analysisCache.get(url)!;
}

function downsample(samples: Float32Array, targetLen: number): Float32Array {
  const out = new Float32Array(targetLen);
  const block = samples.length / targetLen;
  for (let i = 0; i < targetLen; i++) {
    const start = Math.floor(i * block);
    const end = Math.min(Math.floor((i + 1) * block), samples.length);
    let max = 0;
    for (let j = start; j < end; j++) {
      const a = Math.abs(samples[j]);
      if (a > max) max = a;
    }
    out[i] = max;
  }
  return out;
}

function averageSpectrum(
  samples: Float32Array,
  fftSize: number,
  hop: number
): Float32Array {
  const len = fftSize / 2 + 1;
  const sum = new Float32Array(len);
  let count = 0;
  for (let start = 0; start + fftSize <= samples.length; start += hop) {
    const mag = magnitudeSpectrum(samples.subarray(start, start + fftSize), fftSize);
    for (let i = 0; i < len; i++) sum[i] += mag[i];
    count++;
  }
  if (count === 0) return sum;
  for (let i = 0; i < len; i++) sum[i] /= count;
  return sum;
}
