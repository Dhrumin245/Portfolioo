/**
 * Convert a string into a clean, URL-safe slug.
 * Removes slashes, spaces, and special characters.
 * Example: "case study / web application" -> "case-study-web-application"
 */
export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\/\\]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}
