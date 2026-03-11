import { magnitudeSpectrum } from "./fft";

const FFT_SIZE = 2048;
const SPECTRUM_HOP = 1024;
const SPECTROGRAM_HOP = 512;
const WAVEFORM_POINTS = 1500;

export type AnalysisResult = {
  waveform: Float32Array;
  spectrum: Float32Array;
  spectrogram: Float32Array[]; // each row = spectrum at a time slice
  duration: number;
  sampleRate: number;
};

export async function analyzeAudioFromUrl(url: string): Promise<AnalysisResult> {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const buffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
  const channel = buffer.getChannelData(0);
  const sampleRate = buffer.sampleRate;
  const duration = buffer.duration;

  const waveform = downsample(channel, WAVEFORM_POINTS);

  const spectrum = averageSpectrum(channel, FFT_SIZE, SPECTRUM_HOP);

  const spectrogram: Float32Array[] = [];
  for (let start = 0; start + FFT_SIZE <= channel.length; start += SPECTROGRAM_HOP) {
    const slice = channel.subarray(start, start + FFT_SIZE);
    spectrogram.push(magnitudeSpectrum(slice, FFT_SIZE));
  }

  return { waveform, spectrum, spectrogram, duration, sampleRate };
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
