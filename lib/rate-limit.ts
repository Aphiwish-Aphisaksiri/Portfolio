const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

const requests = new Map<string, number>();

let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [ip, timestamp] of requests) {
    if (now - timestamp > WINDOW_MS) {
      requests.delete(ip);
    }
  }
}

export function isRateLimited(ip: string): boolean {
  cleanup();
  const now = Date.now();
  const lastRequest = requests.get(ip);
  if (lastRequest && now - lastRequest < WINDOW_MS) {
    return true;
  }
  requests.set(ip, now);
  return false;
}
