// Automatic delivery runs only on the DM Studio Railway deployment.
// No bot credentials are exposed to the browser.
export const briefEndpoint = typeof window !== "undefined" && window.location.hostname === "dm-studio-production.up.railway.app"
  ? "https://dm-studio-production.up.railway.app/api/brief"
  : "";
