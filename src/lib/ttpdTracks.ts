// 3 tracks from The Tortured Poets Department for comparison
// Place your audio files in public/audio/ttpd/ (e.g. 1.mp3, 2.mp3, ...)
const base = process.env.NEXT_PUBLIC_PAGES_BASE_PATH ?? "";

export const TTPD_TRACKS = [
  { id: 1, title: "Fortnight", src: `${base}/audio/ttpd/1.mp3` },
  { id: 2, title: "The Tortured Poets Department", src: `${base}/audio/ttpd/2.mp3` },
  { id: 3, title: "My Boy Only Breaks His Favorite Toys", src: `${base}/audio/ttpd/2.mp3` },
];
