/**
 * Safe structured-data serialization for embedding inside
 * `<script type="application/ld+json">`. Escapes `<`/`>`/`&` (so a stray
 * `</script>` inside a string value can't close the tag early or inject
 * markup) and the U+2028/U+2029 line/paragraph separators (valid in JSON
 * strings, but break JS parsers if ever interpreted as script content).
 */
const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .split("<")
    .join("\\u003c")
    .split(">")
    .join("\\u003e")
    .split("&")
    .join("\\u0026")
    .split(LINE_SEPARATOR)
    .join("\\u2028")
    .split(PARAGRAPH_SEPARATOR)
    .join("\\u2029");
}
