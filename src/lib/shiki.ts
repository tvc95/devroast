import { codeToHtml } from "shiki";

export async function highlightCode(code: string, lang: string = "javascript") {
  const html = await codeToHtml(code, {
    lang,
    theme: "vesper",
  });

  return html;
}
