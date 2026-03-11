// Изображения кассет из public/tapes. На GitHub Pages нужен basePath.
const base = process.env.NEXT_PUBLIC_PAGES_BASE_PATH ?? "";

export const CASSETTE_IMAGES: Record<string, string> = {
  "type-i": `${base}/tapes/type-i.png`,
  "type-ii": `${base}/tapes/type-ii.png`,
  "type-iii": `${base}/tapes/type-iii.png`,
  "type-iv": `${base}/tapes/type-iv.png`,
  original: `${base}/tapes/original.png`,
};
