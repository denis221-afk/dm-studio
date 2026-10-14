// A lost POST response is not proof that Telegram did not receive the enquiry.
// Recover by reading its status; never automatically send the POST again.
export async function sendBrief(endpoint, values, {
  fetchImpl = fetch,
  requestId = crypto.randomUUID(),
  pause = (ms) => new Promise(resolve => setTimeout(resolve, ms)),
} = {}) {
  try {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, requestId }),
      signal: AbortSignal.timeout(30000),
    });
    const result = await response.json();
    if (response.ok && result.ok === true) return;
  } catch { /* The acknowledgement may have been lost. */ }
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetchImpl(`${endpoint}/status?requestId=${encodeURIComponent(requestId)}`, {
        cache: "no-store", signal: AbortSignal.timeout(5000),
      });
      const result = await response.json();
      if (response.ok && result.status === "sent") return;
      if (result.status === "failed") break;
    } catch { /* Keep the enquiry in the form if status cannot be read. */ }
    if (attempt < 3) await pause(1000);
  }
  throw new Error("delivery-unconfirmed");
}
