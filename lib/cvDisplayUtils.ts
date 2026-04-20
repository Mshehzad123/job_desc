export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function safeHref(url: string, fallback: `https://${string}`): string {
  const t = url.trim();
  if (!t) return fallback;
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}
