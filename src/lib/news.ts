import uz from "../../messages/uz.json";

export type NewsItem = {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  /** Full article body as an ordered list of paragraphs. */
  body?: string[];
};

// Cover images keyed by news id (text content lives in messages/*.json).
export const newsCovers: Record<string, string> = {
  "1": "https://lh3.googleusercontent.com/aida-public/AB6AXuDWnwXtI891r9g6cTznBB_fqdnuDz-OF9aNfYixiNq8bCujaLQDC0SV6K7gw5XD7h_oyFP2wkv0pZFpTxtOYXJI7CMscu0rbjKvx92UO6nkrprUXJ50y_P1vEzVsuQ7g_PYbh2GtC0HgBW7veLCZMxKfqY6Sh-Tx6XWf2_IidenqN-8_NouLa6cKE2klCwDDp9NdQ86X4cdPTvA2uulB7fOA_JMO5wwVrwNlgdP5-v3hNedoDtPArldCeOCL_Hw3WE3TA",
  "2": "https://lh3.googleusercontent.com/aida-public/AB6AXuDH14gTKSxbFXRI7w7QZOAeBauH1G9RpmniSbN0bpfUXeCAM6XnGQ_xPZSz1Q-o3e1GVDYsq6mxqFXNc6vojE9VptrlnVFnqWiZ-DwZHMgH89xymrkbaKhB-M9WyW6b-QDvL-ABQJmn9Itlgjoy3OX7g38cGAjrH6zTA70cp0SQthMYcNpuztdf_BjkJRhmQZW-9da9qtvECArqK6hxn_6Uy3VxwE4c1XMh_ULLrQkaMFM5eKclw7Ej",
  "3": "https://lh3.googleusercontent.com/aida-public/AB6AXuCywby1vGL9EpfZbMM83ELv-eWuEjT72gRbaQCNFHrlrFn8NGPav0uuimRRp780l7B3CBcwLFJX5mvyzyUdh5_-pGEpQVTqWPM74CWnsKZOUO1QR1WA3-M1DWSvi5_DhyHwfZ7MI5alliskHn2HsPuAOrjE80f49nazsw6DFHLtAtVTx6AsAy-QaXpZP7-8lq94gCUV2EiXgj___7bx0pAiEo5NAcuViDfbiGLbXMSoBp1_ctb5b1ra",
};

// Placeholder covers for the additional archive items (ids 4–30): reuse the
// three real images cyclically until real photos are supplied.
for (let i = 4; i <= 30; i++) {
  newsCovers[String(i)] = newsCovers[String(((i - 1) % 3) + 1)];
}

// Optional extra images shown inside the article body (below the paragraphs).
export const newsBodyImages: Record<string, string[]> = {
  "1": [newsCovers["2"]],
};

/** News ids for static generation (locale-independent, sourced from Uzbek). */
export function getNewsIds(): string[] {
  return (uz.News.items as NewsItem[]).map((n) => n.id);
}

/** Sort a list of news items newest first (ISO dates sort as text). */
export function sortByDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}
