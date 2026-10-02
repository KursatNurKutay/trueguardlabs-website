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

## Koby Soft page

- `/en/about/` and `/tr/about/` (menu: About / Hakkımızda; footer Koby logo links to it). Wording lives in `tools/build.mjs` (`A` object). Story text is the owner's Turkish text; the English is a translation to be reviewed. Product cards use text names (no RentFlow/DentFlow logo files yet) and link to rentflowrentals.com and dentflowclinic.com.

## Still open before go-live

1. ~~Koby logo~~ done: `assets/img/koby-logo.png` (white-K version for the dark footer; original in `koby-logo-original.webp`). It is not linked anywhere; add a link to kobysoft.app only if wanted.
2. Privacy Policy pages (GDPR-based, with a short KVKK section) are DRAFTS. Resolve every bracketed item, have a qualified person review, then remove the draft banner in `tools/build.mjs`.
3. The five other "Verified findings" from the old site (only the lost-booking one is included).
4. Turkish wording review by the owner.
5. Migadu mailbox and DNS records, Vercel project and env vars, then DNS switch in Cloudflare. Registrar transfer to Cloudflare is deferred until after launch.
6. ~~Decide indexing~~ done: noindex removed, robots.txt and sitemap.xml added, GTM-T89BSZ75 added via tools/build.mjs. Privacy section 10 (Cookies) still says no cookies/analytics and must be reworded by the owner.

---

<!-- Rest of the handover goes below. -->
