const ENDPOINT = 'https://api.web3forms.com/submit';
const TIMEOUT_MS = 12000;

/**
 * Sends a validated message through Web3Forms, which emails it to the address
 * registered for the access key. The recipient is therefore fixed server-side:
 * nothing a visitor types can redirect the message. The key is public by design.
 */
export async function sendMessage(accessKey, { name, email, message }) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Portfolio enquiry from ${name}`,
        from_name: 'Portfolio contact form',
        name,
        email,
        message,
        botcheck: '',
      }),
      signal: controller.signal,
      credentials: 'omit',
      referrerPolicy: 'strict-origin-when-cross-origin',
    });
    const data = await response.json().catch(() => ({}));
    return { ok: response.ok && data.success === true };
  } catch {
    return { ok: false };
  } finally {
    window.clearTimeout(timer);
  }
}
