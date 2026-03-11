/**
 * In-place radix-2 Cooley-Tukey FFT (power-of-2 length).
 * Input: real, imag Float32Arrays. Output: in-place.
 */
function fft(
  real: Float32Array,
  imag: Float32Array,
  inverse: boolean
): void {
  const n = real.length;
  if (n !== imag.length || (n & (n - 1)) !== 0) return;

  const sign = inverse ? 1 : -1;
  for (let i = 0, j = 0; i < n; i++) {
    if (i < j) {
      [real[i], real[j]] = [real[j], real[i]];
      [imag[i], imag[j]] = [imag[j], imag[i]];
    }
    let bit = n >> 1;
    while (j & bit) {
      j ^= bit;
      bit >>= 1;
    }
    j |= bit;
  }

  for (let len = 2; len <= n; len *= 2) {
    const theta = (sign * 2 * Math.PI) / len;
    const wpr = Math.cos(theta) - 1;
    const wpi = Math.sin(theta);
    let wr = 1;
    let wi = 0;
    for (let m = 0; m < len; m += 2) {
      for (let i = m; i < n; i += len * 2) {
        const j = i + len;
        const tr = wr * real[j] - wi * imag[j];
        const ti = wr * imag[j] + wi * real[j];
        real[j] = real[i] - tr;
        imag[j] = imag[i] - ti;
        real[i] += tr;
        imag[i] += ti;
      }
      const wtemp = wr;
      wr = wr + wr * wpr - wi * wpi;
      wi = wi + wi * wpr + wtemp * wpi;
    }
  }
  if (inverse) {
    for (let i = 0; i < n; i++) {
      real[i] /= n;
      imag[i] /= n;
    }
  }
}

/** Hann window */
function hann(samples: Float32Array, out: Float32Array): void {
  const n = Math.min(samples.length, out.length);
  for (let i = 0; i < n; i++) {
    out[i] = samples[i] * (0.5 * (1 - Math.cos((2 * Math.PI * i) / (n - 1))));
  }
}

/** Returns magnitude spectrum (length fftSize/2 + 1) from real samples with Hann window. */
export function magnitudeSpectrum(
  samples: Float32Array,
  fftSize: number
): Float32Array {
  const real = new Float32Array(fftSize);
  const imag = new Float32Array(fftSize);
  hann(samples.subarray(0, Math.min(fftSize, samples.length)), real);
  fft(real, imag, false);
  const out = new Float32Array(fftSize / 2 + 1);
  for (let i = 0; i < out.length; i++) {
    out[i] = Math.hypot(real[i], imag[i]);
  }
  return out;
}
