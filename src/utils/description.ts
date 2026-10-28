export const withoutEmoji = (text: string) =>
  text
    .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0E\uFE0F\u200D]/gu, "")
    .replace(/[ \t]+/g, " ")
    .trim();

const isHeading = (text: string) =>
  text.length <= 160 &&
  /\p{L}/u.test(text) &&
  (text === text.toLocaleUpperCase("es") || /^¿[^?]+\?$/.test(text));

export interface DescriptionSection {
  heading: string;
  paragraphs: string[];
}

export function formatDescription(description: string, name: string) {
  const lines = description.split(/\r?\n/).map(withoutEmoji).filter(Boolean);
  const title = lines.length && isHeading(lines[0]) ? lines.shift()! : withoutEmoji(name);
  const sections: DescriptionSection[] = [];

  for (const line of lines) {
    if (isHeading(line)) {
      sections.push({ heading: line, paragraphs: [] });
    } else {
      if (!sections.length) sections.push({ heading: "", paragraphs: [] });
      sections[sections.length - 1].paragraphs.push(line);
    }
  }

  return { title, sections };
}
