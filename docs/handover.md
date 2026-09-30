# TrueGuard Labs Website — Handover

## About TrueGuard Labs

- **What it is:** TrueGuard Labs. Tagline: "Independent AI Verification".
- **What it does:** Humans independently audit the AI a business already uses (chatbots, assistants) and check it works as expected. The client gets documented findings and a TrueGuard Health Score™ (10 categories, up to 50 test scenarios, re-verification after fixes).
- **Who it is for:** Any business anywhere that uses AI. No industry or region focus.
- **Relationship to Koby Soft:** A Koby Soft product; the footer shows the Koby mark and tagline like DentFlow's.
- **Visitor action:** Contact by form, email, phone or WhatsApp. Reply within 24 hours.
- **State:** Parked, not promoted. Launches hidden from search engines (`X-Robots-Tag: noindex` in `vercel.json`); remove that header when the owner decides to be indexed, then add robots.txt and sitemap.
- **Languages:** English (default, `/en/`) and Turkish (`/tr/`).
- **Brand:** Navy and orange from the circuit-check logo; layout inspired by dentflowclinic.com.
- **Contact details on page:** info@trueguardlabs.com, +90 (543) 742 44 33, WhatsApp. No postal address.
- **Feel:** Serious and trustworthy, like a lab or auditor.

## Build status

- Site is plain HTML in `en/` and `tr/`, generated from `tools/build.mjs` (`node tools/build.mjs`). Edit wording there, not in the HTML.
- Contact form posts to `api/contact.js` (Vercel function, Nodemailer over Migadu SMTP). Vercel environment variables needed: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`. Use a dedicated form mailbox, not the info@ password.
- No tracking. Any Google tag goes in via Tag Manager and only with the owner's approval.

## Still open before go-live

1. Koby logo file for the footer (currently a text mark; see TODO in `tools/build.mjs`).
2. Privacy Policy (KVKK) pages are DRAFTS: base them on dentflowclinic.com/en/privacy, fill the bracketed items, remove the draft banner.
3. The five other "Verified findings" from the old site (only the lost-booking one is included).
4. Turkish wording review by the owner.
5. Migadu mailbox and DNS records, Vercel project and env vars, then DNS switch in Cloudflare. Registrar transfer to Cloudflare is deferred until after launch.
6. Decide indexing.

---

<!-- Rest of the handover goes below. -->
