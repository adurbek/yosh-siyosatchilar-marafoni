// Photo URLs for the media gallery, keyed by album id (album metadata such as
// the date lives in messages/*.json). Replace these with real album photos.
const POOL = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA2Ah3N19NOiGphFpgM6OjgfjGCJ0Zn3pTFDKigRIpPWu6dmZsWdQQQAMEeMcou3O3inB3TRdhnU23OHW6rSDktbTzoMVOGu4EOVXFSCJVs0i7yfrQ3WGjlzqnzyQrelmDn8Sg48AjjdR31aaJ9a7FpEUUMernqYCpGQNACV4KLZYbBGsKSWbS5G1iZp0LZ6IcEOIcHb0uOPus56KVhoSwetkTQBFHTelvHCti7iA4FYyFI3yX1hmXi",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB0oW0e7qc58HVv9cGeXWV19nVNcq2zWW0cGDJLaoaohPyrp8I2Ld8onVSOSADcQtnP7d-WttJz1ZdES1Vaj0ySw47M65bbRHaqlA84ilGCbR9zhyG9zGHmnfOa7P7ckKsLEAVYHRT3_NF7ASpqTII2LwurNqR2-R4ZL31ixs6QMkL2-yWUvB7RWzTvfPAteLj09t5lsUHohQu-76m5C1Z2ox4B8M-jtF8bcYpDOUnN79-eCGpIyACl",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB3maoAgkGltrcsAYeKD0-rzZYpkBBQfcfT80UDsESIZ1mpJRXvN-xRkDbN5ql3x4NRbluQ03t0WLfGOzMz7JzZxs68qhmWNu7B9rvIGOCL9LggGtz_o5lAL_p5P4hBGNX6boG_S0npGMgo43WVUJY2G2zKq2er4B76iSysTBXNVymMc_EodjpPbSHV2uDQLDEiwopf7sZHxOtBCzxLiGjeGXSjMCyJJiFPcCQNom5mi79eVOdFzuxv",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCgPitXe175mPoocWSJyaRH3WcUgwI6G2WpZYvdPZwklosUY689OhWhZ-gn_tk92klxRIyEU3E3jlJDnBwBbAwRh4NpUGc_CXfBquGqDoz9PUiB-jfqFzetvx-Ro3dT-MI5Ko7UksN1F-dlnDcOkVjblDvlmqQVmm-b88FuTjX5fySbps6QEd7X2lF0tw3aMvWazTP58comEw-qLuRemZpkYwQbqokxRDJ0idGkSABdAKRUqJeM1fuZ",
];

/** Build an album of `count` photos by cycling the shared pool (placeholder). */
function album(count: number): string[] {
  return Array.from({ length: count }, (_, i) => POOL[i % POOL.length]);
}

export const mediaPhotos: Record<string, string[]> = {
  a1: album(6),
  a2: album(6),
};

// Video URLs keyed by video-album id. Replace with real conference videos.
const SAMPLE_VIDEO =
  "https://api.sdg2030.uz/storage/4950c807-78f0-4db7-95a9-2042ff60d71c.mp4";

export const mediaVideos: Record<string, string[]> = {
  v1: [SAMPLE_VIDEO],
};
