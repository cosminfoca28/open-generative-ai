// Pure validation helpers, also usable with Node's built-in test runner.
export function validateImagePrompt(value) {
  if (typeof value !== 'string') return null;
  const prompt = value.trim();
  if (prompt.length < 3 || prompt.length > 600) return null;
  return prompt;
}

export function readCloudflareImage(payload) {
  // The FLUX Schnell Workers AI model returns a base64 JPEG in result.image.
  const encoded = payload?.result?.image;
  if (typeof encoded !== 'string' || encoded.length < 100) return null;
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(encoded) || encoded.length % 4 !== 0) return null;
  return `data:image/jpeg;base64,${encoded}`;
}
