# Rate Limiting & Bot Protection — Implementation Plan

## Problem

The `/api/contact` route has no rate limiting or bot protection. Bots can:

- Spam the Resend email API (burning quota)
- Flood the inbox with junk messages
- Abuse the endpoint with automated requests

## Strategy

Three layers of defense:

1. **Cloudflare (edge)** — Bot Fight Mode + WAF rate limiting rule on `/api/contact`
2. **Honeypot field (server)** — Hidden form field that catches dumb bots
3. **In-memory rate limiter (server)** — 1 request per IP per day, defense-in-depth backup

---

## Layer 1: Cloudflare (Edge Protection)

Configured in the Cloudflare dashboard — no code changes needed.

- **Bot Fight Mode** — Settings > Security > Bots > toggle on
- **WAF Rate Limiting Rule** — Security > WAF > Rate limiting rules > Create rule
  - Match: URI path equals `/api/contact` AND method equals `POST`
  - Rate: 1 request per 24 hours per IP
  - Action: Block with 429 response

This stops abuse before it reaches Vercel.

---

## Layer 2: Honeypot Field (Client + Server)

A hidden form field that real users never see or fill in. Bots auto-fill all fields, so a filled honeypot = reject.

### Changes

| File | Change |
|------|--------|
| `components/sections/Contact.tsx` | Add a hidden `website` field to the form (visually hidden via CSS, not `display:none` which smart bots detect) |
| `app/api/contact/route.ts` | Reject requests where `website` field is non-empty |

### Details

- Field name: `website` (a natural-looking name bots are likely to fill)
- Hidden using `position: absolute; left: -9999px; opacity: 0` + `tabIndex={-1}` + `autoComplete="off"`
- No changes to Zod schema validation (honeypot is checked separately before schema)
- Returns `200 { success: true }` on honeypot trigger (don't reveal detection to bots)

---

## Layer 3: In-Memory Rate Limiter (Server-side Backup)

Defense-in-depth in case someone hits the Vercel URL directly (bypassing Cloudflare).

- Uses a `Map<string, number>` in module scope (IP → timestamp of last request)
- **1 request per IP per 24 hours**
- IP extracted from `x-forwarded-for` header (standard on Vercel)
- Stale entries cleaned up periodically to prevent memory growth
- Resets on serverless cold starts — acceptable since Cloudflare is the primary enforcer

### Changes

| File | Change |
|------|--------|
| `lib/rate-limit.ts` | Create in-memory rate limiter (1 req / 24h per IP) |
| `app/api/contact/route.ts` | Check rate limit before processing; return 429 if exceeded |
| `components/sections/Contact.tsx` | Handle 429 response with user-friendly message |

---

## Implementation Order

1. **Honeypot field** — Add hidden field to form + server-side check
2. **Create rate limiter** — `lib/rate-limit.ts` with in-memory Map
3. **Wire into API route** — Honeypot check → rate limit check → process email
4. **Update client** — Show "Too many requests" message on 429
5. **Cloudflare config** — Enable Bot Fight Mode + create WAF rate limit rule (manual, in dashboard)

---

## Rate Limit Config

```
Strategy: In-memory Map (server) + Cloudflare WAF (edge)
Limit: 1 request per 24 hours per IP
Response: 429 Too Many Requests
Cleanup: Stale entries purged every hour
```

---

## No Environment Variables Required

The in-memory approach needs no external services or API keys.

---

## Security Notes

- Honeypot returns `200` to avoid leaking detection logic
- Rate limit returns `429` with generic message (no IP or timing details exposed)
- `x-forwarded-for` is trusted on Vercel; if self-hosting, ensure the reverse proxy sets this correctly
- Input sanitization for the HTML email body (XSS in email) is a separate concern — currently uses raw interpolation in the email template
