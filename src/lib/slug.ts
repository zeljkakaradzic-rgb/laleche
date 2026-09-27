const SERBIAN_LATIN_MAP: Record<string, string> = {
  č: "c",
  ć: "c",
  đ: "dj",
  š: "s",
  ž: "z",
  Č: "c",
  Ć: "c",
  Đ: "dj",
  Š: "s",
  Ž: "z",
};

export function slugify(input: string): string {
  const transliterated = input
    .split("")
    .map((char) => SERBIAN_LATIN_MAP[char] ?? char)
    .join("");

  return transliterated
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
