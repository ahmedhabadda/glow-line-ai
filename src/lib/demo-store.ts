const KEYS = {
  knowledge: "glowline.demo.knowledge",
  reviews: "glowline.demo.reviews",
} as const;

export function readDemoValue<T>(key: keyof typeof KEYS, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(KEYS[key]);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeDemoValue<T>(key: keyof typeof KEYS, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS[key], JSON.stringify(value));
}
