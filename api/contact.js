// Vercel serverless function: receives the contact form and emails it via Migadu SMTP.
// Required environment variables (set in Vercel, never in the repo):
//   SMTP_HOST   e.g. smtp.migadu.com
//   SMTP_PORT   e.g. 465
//   SMTP_USER   the dedicated form mailbox, e.g. forms@trueguardlabs.com
//   SMTP_PASS   that mailbox's password
//   CONTACT_TO  where enquiries are delivered, e.g. info@trueguardlabs.com
const nodemailer = require("nodemailer");

const hits = new Map(); // simple per-instance rate limit: 5 requests / 10 min / IP
function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

// Accept "example.com" as well as "https://example.com"; keep it as typed otherwise.
const url = (v, max) => {
  const t = clean(v, max);
  return t && !/^https?:\/\//i.test(t) ? "https://" + t : t;
};
const phoneClean = (v) => String(v == null ? "" : v).replace(/[^0-9+()\-.\s]/g, "").replace(/\s+/g, " ").trim().slice(0, 40);
const clean = (v, max) => String(v == null ? "" : v).replace(/[\r\n]+/g, " ").trim().slice(0, max);
const cleanBlock = (v, max) => String(v == null ? "" : v).replace(/\r/g, "").trim().slice(0, max);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

module.exports = async (req, res) => {
  const wantsJson = (req.headers.accept || "").includes("application/json");
  const done = (status, ok, lang) => {
    if (wantsJson) return res.status(status).json({ ok });
    return res.redirect(303, `/${lang === "tr" ? "tr" : "en"}/?sent=${ok ? 1 : 0}#contact`);
  };

  if (req.method !== "POST") return res.status(405).json({ ok: false });

  const b = req.body || {};
  const lang = b.lang === "tr" ? "tr" : "en";

  // Honeypot: real people leave this hidden field empty. Pretend success to bots.
  if (b.hp) return done(200, true, lang);

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (limited(ip)) return done(429, false, lang);

  const name = clean(b.name, 120);
  const email = clean(b.email, 160);
  const company = clean(b.company, 120);
  const phone = phoneClean(b.phone);
  const website = url(b.website, 200);
  const aiUrl = url(b.ai_url, 200);
  const message = cleanBlock(b.message, 2000);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || !company || !emailOk || b.consent !== "yes") return done(400, false, lang);

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
    console.error("contact form: missing SMTP environment variables");
    return done(500, false, lang);
  }

  const port = Number(SMTP_PORT) || 465;
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const rows = [
    ["Name", name], ["Company", company], ["Email", email], ["Phone / WhatsApp", phone],
    ["Website", website], ["AI assistant URL", aiUrl], ["Language", lang],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\nMessage:\n${message || "-"}\n`;
  const html = rows.map(([k, v]) => `<p><b>${k}:</b> ${esc(v)}</p>`).join("") +
    `<p><b>Message:</b></p><p>${esc(message || "-").replace(/\n/g, "<br>")}</p>`;

  try {
    await transport.sendMail({
      from: `"TrueGuard Labs Website" <${SMTP_USER}>`,
      to: CONTACT_TO,
      replyTo: `"${name.replace(/"/g, "")}" <${email}>`,
      subject: `[TrueGuard Labs] New enquiry from ${name}${company ? " (" + company + ")" : ""}`,
      text,
      html,
    });
    return done(200, true, lang);
  } catch (err) {
    console.error("contact form: send failed", err && err.message);
    return done(502, false, lang);
  }
};
