// Same-site check for the Free Studio API. Compares the Origin header's host
// with the hosts the request was addressed to. Behind Netlify's proxy,
// request.url may not carry the public host, so forwarded/host headers count too.
export function isSameHostRequest(origin, { forwardedHost, host, url } = {}) {
  let originHost;
  try { originHost = new URL(origin).host; } catch { return false; }
  if (!originHost) return false;
  let urlHost = null;
  try { urlHost = url ? new URL(url).host : null; } catch { urlHost = null; }
  const hosts = [forwardedHost, host, urlHost]
    .filter(Boolean)
    .flatMap((value) => String(value).split(',').map((h) => h.trim().toLowerCase()));
  return hosts.includes(originHost.toLowerCase());
}
