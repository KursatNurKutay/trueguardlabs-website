// Generates the plain-HTML pages (en/, tr/) from one content file.
// Run: node tools/build.mjs   (only needed when wording changes; Vercel just serves the output)
import { writeFileSync, mkdirSync } from "node:fs";

const SITE = "https://trueguardlabs.com";
const EMAIL = "info@trueguardlabs.com";
const PHONE_DISPLAY = "+90 (543) 742 44 33";
const PHONE_TEL = "+905437424433";
const WA = "https://wa.me/905437424433";

const scores = [62, 78, 45, 30, 55, 70, 58, 40, 35, 85]; // example only; average = 56
const barColor = (v) => (v >= 75 ? "var(--ok)" : v >= 50 ? "var(--warn)" : "var(--bad)");

const T = {
  en: {
    lang: "en",
    other: { code: "tr", label: "TR" },
    title: "TrueGuard Labs — Independent AI Verification",
    description:
      "TrueGuard Labs independently verifies your AI assistant’s accuracy, reliability and business impact, and gives you documented evidence and a TrueGuard Health Score™.",
    ogLocale: "en_US",
    skip: "Skip to content",
    nav: [["#problem", "Why verify"], ["#verify", "What we verify"], ["#how", "How it works"], ["#contact", "Contact"]],
    cta: "Get Your AI Health Score",
    eyebrow: "Independent AI verification",
    h1: ["You trust your AI. ", "We verify it."],
    lead: "Your AI talks to your customers around the clock. TrueGuard Labs independently verifies its accuracy, reliability and business impact, so you know exactly what it is telling them.",
    seeVerify: "See what we verify",
    mock: {
      bar: "AI chat audit", tag: "FAIL",
      user: "What is your policy for changing or cancelling a booking?",
      ai: "You can cancel or change your booking up to 24 hours before check-in for a full refund.",
      flag: ["Finding:", " the answer contradicts the company’s written policy. Severity: high."],
      note: "Illustrative example",
    },
    stats: [["10", "Categories verified"], ["4", "Simple steps"], ["50", "Up to 50 test scenarios"], ["24h", "Reply time"]],
    problem: {
      h: ["Most AI assistants fail ", "silently."],
      p: "Customers rarely tell you. They simply leave. Without independent verification, you have no idea what your AI is really telling your customers.",
      without: "Without verification",
      withh: "With TrueGuard Labs",
      wo: [
        "Losing leads by failing to capture enquiries",
        "Inventing information that doesn’t exist",
        "Mishandling bookings and reservations",
        "Frustrating customers with circular responses",
        "Failing to escalate to a human when needed",
        "Contradicting your own company policies",
      ],
      wi: [
        "You know what your AI actually tells customers",
        "Every issue documented with evidence",
        "Severity-rated findings you can act on",
        "Fixes re-verified after you correct them",
        "A clear score you can track over time",
      ],
    },
    verify: {
      h: "What we verify",
      p: "Ten categories of AI behaviour, checked from the perspective of a real customer.",
      cats: [
        ["Accuracy", "Factual correctness of responses"],
        ["Tone & Empathy", "Customer experience quality"],
        ["Booking Handling", "Reservation and scheduling"],
        ["Escalation", "Human handover triggers"],
        ["Multilingual", "Cross-language consistency"],
        ["Data Privacy", "Personal information handling"],
        ["Policy Compliance", "Alignment with company rules"],
        ["Edge Cases", "Unusual or adversarial inputs"],
        ["Lead Capture", "Enquiry conversion ability"],
        ["Performance", "Response speed and availability"],
      ],
    },
    findings: {
      h: "Verified findings",
      p: "Real issues documented during independent verification. Names and details are anonymised.",
      title: "Lost booking enquiry",
      sev: "HIGH SEVERITY",
      user: "I’d like to book a double room for 15–18 March.",
      ai: "Great choice! Our double rooms are very popular. Is there anything else I can help with?",
      reality: ["Verified reality:", " Dates and preference acknowledged but never captured as a lead."],
      impact: ["Business impact:", " Direct revenue loss. Customer books with a competitor."],
    },
    how: {
      h: "How it works",
      p: "Four straightforward stages, from briefing to verified improvement.",
      steps: [
        ["Brief us", "Tell us how your AI should work: its purpose, policies and expected behaviour."],
        ["We verify", "We interact with your AI as real customers across dozens of realistic scenarios."],
        ["You receive evidence", "Detailed findings with documented evidence, transcripts, severity ratings and your TrueGuard Health Score™."],
        ["We re-verify", "After you make corrections, we verify that the issues are resolved."],
      ],
    },
    score: {
      h: "TrueGuard Health Score™",
      p: "Every verification produces a clear, measurable TrueGuard Health Score™. Our proprietary methodology scores your AI across ten critical categories, giving you an objective benchmark for customer-facing AI performance.",
      label: "TrueGuard Health Score™",
      pill: "Critical",
      pillNote: "Needs immediate attention",
      example: "Example",
      legend: [["var(--ok)", "75–100 Verified"], ["var(--warn)", "50–74 Needs work"], ["var(--bad)", "0–49 Critical"]],
    },
    why: {
      h: "Why TrueGuard Labs?",
      items: [
        ["Independent", "We don’t build AI systems. We independently verify them."],
        ["Evidence-based", "Every finding includes documented evidence and real conversation examples."],
        ["Business focused", "We measure customer experience, commercial impact, compliance and operational risk, not just technical accuracy."],
      ],
    },
    contact: {
      h: "Get your TrueGuard Health Score™",
      p: "Tell us about your AI assistant and we’ll get back to you within 24 hours.",
      name: "Name", namePh: "Your full name",
      company: "Company", companyPh: "Company name",
      email: "Email", emailPh: "you@company.com",
      website: "Website", websitePh: "https://yourcompany.com",
      ai: "AI assistant URL (optional)", aiPh: "Link to your chatbot or AI system",
      message: "Message (optional)", messagePh: "Anything we should know?",
      consent: ["I have read the ", "Privacy Policy (KVKK)", " and agree that TrueGuard Labs may contact me about my enquiry."],
      submit: "Request Verification",
      sending: "Sending…",
      ok: "Thank you. Your message has been sent and we will reply within 24 hours.",
      err: "Sorry, something went wrong. Please email us directly at " + EMAIL + ".",
      infoH: "Contact us directly",
      emailL: "Email", phoneL: "Phone", wa: "Chat on WhatsApp",
      chooseNote: "Choose whichever way suits you best.",
    },
    footer: {
      line: "Independent AI verification for businesses worldwide.",
      rights: "© 2026 TrueGuard Labs. All rights reserved.",
      privacy: "Privacy Policy (KVKK)",
      koby: ["Smart solutions", " for growing businesses."],
    },
    privacyPath: "/en/privacy/",
    privacy: {
      title: "Privacy Policy (KVKK) — TrueGuard Labs",
      description: "How TrueGuard Labs collects and uses personal data submitted through this website.",
      h1: "Privacy Policy (KVKK)",
      draft: "DRAFT: this text is a working draft for review and has not been approved. It must be checked and finalised before the site goes live.",
      back: "← Back to home",
      body: `
<h2>1. Data controller</h2>
<p>[Legal entity name, registration details and contact address of the data controller — to be completed.] TrueGuard Labs is a product of Koby Soft. You can contact us at <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>
<h2>2. What data we collect</h2>
<p>Only what you send us through the contact form or by email, phone or WhatsApp: your name, company, email address, website, the link to your AI assistant (optional) and any message you write.</p>
<h2>3. Why we use it</h2>
<ul><li>To reply to your enquiry and discuss an independent AI verification.</li><li>To prepare and deliver our service if you become a client.</li></ul>
<h2>4. Legal basis</h2>
<p>Your explicit consent given when you submit the form, and our legitimate interest in answering business enquiries. [Legal basis wording under KVKK Article 5 to be confirmed.]</p>
<h2>5. Who receives it</h2>
<p>Form messages are delivered to our own mailbox. We do not sell your data. [Hosting and email providers to be listed and confirmed.]</p>
<h2>6. Retention</h2>
<p>[Retention period to be confirmed.]</p>
<h2>7. Cookies and tracking</h2>
<p>This website does not use cookies or analytics tracking. If this changes, this policy will be updated first.</p>
<h2>8. Your rights</h2>
<p>Under KVKK Article 11 you may ask whether we process your data, request access, correction or deletion, and object to processing. Write to <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>`,
    },
  },

  tr: {
    lang: "tr",
    other: { code: "en", label: "EN" },
    title: "TrueGuard Labs — Bağımsız Yapay Zekâ Doğrulama",
    description:
      "TrueGuard Labs, yapay zekâ asistanınızın doğruluğunu, güvenilirliğini ve iş etkisini bağımsız olarak doğrular; size belgelenmiş kanıtlar ve TrueGuard Sağlık Skoru™ sunar.",
    ogLocale: "tr_TR",
    skip: "İçeriğe geç",
    nav: [["#problem", "Neden doğrulama"], ["#verify", "Neyi doğrularız"], ["#how", "Nasıl çalışır"], ["#contact", "İletişim"]],
    cta: "Yapay Zekâ Sağlık Skorunuzu Alın",
    eyebrow: "Bağımsız yapay zekâ doğrulama",
    h1: ["Yapay zekânıza güveniyorsunuz. ", "Biz doğruluyoruz."],
    lead: "Yapay zekânız müşterilerinizle günün her saati konuşuyor. TrueGuard Labs, doğruluğunu, güvenilirliğini ve iş etkisini bağımsız olarak doğrular; böylece müşterilerinize tam olarak ne söylediğini bilirsiniz.",
    seeVerify: "Neyi doğruladığımızı görün",
    mock: {
      bar: "Yapay zekâ sohbet denetimi", tag: "BAŞARISIZ",
      user: "Rezervasyon değiştirme veya iptal politikanız nedir?",
      ai: "Rezervasyonunuzu girişten 24 saat öncesine kadar tam iadeyle iptal edebilir veya değiştirebilirsiniz.",
      flag: ["Bulgu:", " yanıt şirketin yazılı politikasıyla çelişiyor. Önem derecesi: yüksek."],
      note: "Açıklayıcı örnek",
    },
    stats: [["10", "Doğrulanan kategori"], ["4", "Basit adım"], ["50", "50’ye kadar test senaryosu"], ["24s", "Yanıt süresi"]],
    problem: {
      h: ["Çoğu yapay zekâ asistanı ", "sessizce başarısız olur."],
      p: "Müşteriler size nadiren söyler. Sadece giderler. Bağımsız doğrulama olmadan yapay zekânızın müşterilerinize gerçekte ne söylediğini bilemezsiniz.",
      without: "Doğrulama olmadan",
      withh: "TrueGuard Labs ile",
      wo: [
        "Talepleri kaydedemediği için potansiyel müşteri kaybı",
        "Var olmayan bilgiler uydurma",
        "Rezervasyonları hatalı yönetme",
        "Döngüsel yanıtlarla müşteriyi bezdirme",
        "Gerektiğinde bir insana yönlendirmeme",
        "Kendi şirket politikalarınızla çelişme",
      ],
      wi: [
        "Yapay zekânızın müşterilere gerçekte ne söylediğini bilirsiniz",
        "Her sorun kanıtlarla belgelenir",
        "Önem derecesi belirlenmiş, harekete geçebileceğiniz bulgular",
        "Düzeltmelerinizden sonra çözümler yeniden doğrulanır",
        "Zaman içinde takip edebileceğiniz net bir skor",
      ],
    },
    verify: {
      h: "Neyi doğrularız",
      p: "Yapay zekâ davranışının on kategorisi, gerçek bir müşterinin bakış açısıyla doğrulanır.",
      cats: [
        ["Doğruluk", "Yanıtların olgusal doğruluğu"],
        ["Ton ve Empati", "Müşteri deneyimi kalitesi"],
        ["Rezervasyon Yönetimi", "Rezervasyon ve randevu"],
        ["Yönlendirme", "İnsana devretme tetikleyicileri"],
        ["Çok Dillilik", "Diller arası tutarlılık"],
        ["Veri Gizliliği", "Kişisel bilgilerin yönetimi"],
        ["Politika Uyumu", "Şirket kurallarıyla uyum"],
        ["Uç Durumlar", "Alışılmadık veya kötü niyetli girdiler"],
        ["Talep Toplama", "Talebi müşteriye dönüştürme gücü"],
        ["Performans", "Yanıt hızı ve erişilebilirlik"],
      ],
    },
    findings: {
      h: "Doğrulanmış bulgular",
      p: "Bağımsız doğrulama sırasında belgelenen gerçek sorunlar. İsimler ve ayrıntılar anonimleştirilmiştir.",
      title: "Kaybedilen rezervasyon talebi",
      sev: "YÜKSEK ÖNEM",
      user: "15–18 Mart için çift kişilik bir oda ayırtmak istiyorum.",
      ai: "Harika bir seçim! Çift kişilik odalarımız çok tercih ediliyor. Yardımcı olabileceğim başka bir konu var mı?",
      reality: ["Doğrulanan gerçek:", " Tarihler ve tercih not edildi ancak hiçbir zaman potansiyel müşteri olarak kaydedilmedi."],
      impact: ["İş etkisi:", " Doğrudan gelir kaybı. Müşteri rakibinde rezervasyon yapıyor."],
    },
    how: {
      h: "Nasıl çalışır",
      p: "Bilgilendirmeden doğrulanmış iyileştirmeye dört basit aşama.",
      steps: [
        ["Bize anlatın", "Yapay zekânızın nasıl çalışması gerektiğini anlatın: amacı, politikaları ve beklenen davranışı."],
        ["Biz doğrularız", "Yapay zekânızla gerçek müşteriler gibi onlarca gerçekçi senaryoda etkileşime geçeriz."],
        ["Kanıtları alırsınız", "Belgelenmiş kanıtlar, konuşma dökümleri, önem dereceleri ve TrueGuard Sağlık Skorunuz™ ile ayrıntılı bulgular."],
        ["Yeniden doğrularız", "Düzeltmelerinizi yaptıktan sonra sorunların çözüldüğünü doğrularız."],
      ],
    },
    score: {
      h: "TrueGuard Sağlık Skoru™",
      p: "Her doğrulama net ve ölçülebilir bir TrueGuard Sağlık Skoru™ üretir. Kendimize özgü metodolojimiz yapay zekânızı on kritik kategoride puanlar ve müşteriye dönük yapay zekâ performansı için nesnel bir referans sunar.",
      label: "TRUEGUARD SAĞLIK SKORU™",
      pill: "Kritik",
      pillNote: "Acil dikkat gerekiyor",
      example: "Örnek",
      legend: [["var(--ok)", "75–100 Doğrulandı"], ["var(--warn)", "50–74 Geliştirilmeli"], ["var(--bad)", "0–49 Kritik"]],
    },
    why: {
      h: "Neden TrueGuard Labs?",
      items: [
        ["Bağımsız", "Yapay zekâ sistemleri geliştirmiyoruz. Onları bağımsız olarak doğruluyoruz."],
        ["Kanıta dayalı", "Her bulgu belgelenmiş kanıt ve gerçek konuşma örnekleri içerir."],
        ["İş odaklı", "Yalnızca teknik doğruluğu değil; müşteri deneyimini, ticari etkiyi, uyumu ve operasyonel riski ölçeriz."],
      ],
    },
    contact: {
      h: "TrueGuard Sağlık Skorunuzu™ alın",
      p: "Yapay zekâ asistanınızdan bahsedin, 24 saat içinde size dönelim.",
      name: "Ad Soyad", namePh: "Adınız ve soyadınız",
      company: "Şirket", companyPh: "Şirket adı",
      email: "E-posta", emailPh: "siz@sirket.com",
      website: "Web sitesi", websitePh: "https://sirketiniz.com",
      ai: "Yapay zekâ asistanı bağlantısı (isteğe bağlı)", aiPh: "Chatbot veya yapay zekâ sisteminizin bağlantısı",
      message: "Mesaj (isteğe bağlı)", messagePh: "Bilmemizi istediğiniz bir şey var mı?",
      consent: ["", "Gizlilik Politikası (KVKK)", "’nı okudum ve talebimle ilgili TrueGuard Labs’ın benimle iletişime geçmesini kabul ediyorum."],
      submit: "Doğrulama Talep Et",
      sending: "Gönderiliyor…",
      ok: "Teşekkürler. Mesajınız gönderildi, 24 saat içinde yanıt vereceğiz.",
      err: "Üzgünüz, bir sorun oluştu. Lütfen bize doğrudan " + EMAIL + " adresinden yazın.",
      infoH: "Bize doğrudan ulaşın",
      emailL: "E-posta", phoneL: "Telefon", wa: "WhatsApp’tan yazın",
      chooseNote: "Size en uygun yolu seçin.",
    },
    footer: {
      line: "Dünya genelindeki işletmeler için bağımsız yapay zekâ doğrulama.",
      rights: "© 2026 TrueGuard Labs. Tüm hakları saklıdır.",
      privacy: "Gizlilik Politikası (KVKK)",
      koby: ["Akıllı çözümler", " büyüyen işletmeler için."],
    },
    privacyPath: "/tr/privacy/",
    privacy: {
      title: "Gizlilik Politikası (KVKK) — TrueGuard Labs",
      description: "TrueGuard Labs’ın bu web sitesi üzerinden gönderilen kişisel verileri nasıl topladığı ve kullandığı.",
      h1: "Gizlilik Politikası (KVKK)",
      draft: "TASLAK: bu metin inceleme için hazırlanmış çalışma taslağıdır ve onaylanmamıştır. Site yayına girmeden önce kontrol edilip kesinleştirilmelidir.",
      back: "← Ana sayfaya dön",
      body: `
<h2>1. Veri sorumlusu</h2>
<p>[Veri sorumlusunun ticari unvanı, kayıt bilgileri ve iletişim adresi — tamamlanacak.] TrueGuard Labs, Koby Soft’un bir ürünüdür. Bize <a href="mailto:${EMAIL}">${EMAIL}</a> adresinden ulaşabilirsiniz.</p>
<h2>2. Hangi verileri topluyoruz</h2>
<p>Yalnızca iletişim formu, e-posta, telefon veya WhatsApp üzerinden bize ilettiğiniz bilgiler: adınız, şirketiniz, e-posta adresiniz, web siteniz, yapay zekâ asistanınızın bağlantısı (isteğe bağlı) ve yazdığınız mesaj.</p>
<h2>3. Neden kullanıyoruz</h2>
<ul><li>Talebinizi yanıtlamak ve bağımsız yapay zekâ doğrulamasını görüşmek için.</li><li>Müşterimiz olmanız halinde hizmetimizi hazırlamak ve sunmak için.</li></ul>
<h2>4. Hukuki sebep</h2>
<p>Formu gönderirken verdiğiniz açık rıza ve iş taleplerini yanıtlamadaki meşru menfaatimiz. [KVKK madde 5 kapsamındaki hukuki sebep ifadesi teyit edilecek.]</p>
<h2>5. Kimlere aktarılır</h2>
<p>Form mesajları kendi posta kutumuza iletilir. Verilerinizi satmıyoruz. [Barındırma ve e-posta sağlayıcıları listelenip teyit edilecek.]</p>
<h2>6. Saklama süresi</h2>
<p>[Saklama süresi teyit edilecek.]</p>
<h2>7. Çerezler ve takip</h2>
<p>Bu web sitesi çerez veya analiz amaçlı takip kullanmaz. Bu değişirse önce bu politika güncellenecektir.</p>
<h2>8. Haklarınız</h2>
<p>KVKK madde 11 uyarınca verilerinizin işlenip işlenmediğini sorabilir, erişim, düzeltme veya silme talep edebilir ve işlemeye itiraz edebilirsiniz. <a href="mailto:${EMAIL}">${EMAIL}</a> adresine yazın.</p>`,
    },
  },
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function head(t, path, title, description) {
  const url = `${SITE}${path}`;
  const alt = (l) => `${SITE}/${l}/`;
  return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="en" href="${alt("en")}">
<link rel="alternate" hreflang="tr" href="${alt("tr")}">
<link rel="alternate" hreflang="x-default" href="${alt("en")}">
<meta name="theme-color" content="#0b1f3f">
<meta property="og:type" content="website">
<meta property="og:site_name" content="TrueGuard Labs">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="${t.ogLocale}">
<meta property="og:image" content="${SITE}/assets/img/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${SITE}/assets/img/og.png">
<link rel="icon" type="image/png" href="/assets/img/favicon.png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/css/style.css">
`;
}

function header(t, homePath) {
  return `<a class="skip" href="#main">${t.skip}</a>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="${homePath}"><img src="/assets/img/logo.png" alt="" width="36" height="36"><span>TrueGuard Labs</span></a>
    <nav class="nav" aria-label="Main">${t.nav.map(([h, l]) => `<a href="${homePath}${h}">${l}</a>`).join("")}</nav>
    <div class="lang" aria-label="Language"><span aria-current="true">${t.lang.toUpperCase()}</span><a href="/${t.other.code}/" hreflang="${t.other.code}" lang="${t.other.code}">${t.other.label}</a></div>
  </div>
</header>`;
}

function footer(t) {
  const f = t.footer;
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="foot-top">
      <a class="foot-brand" href="/${t.lang}/"><img src="/assets/img/logo.png" alt="" width="44" height="44"><span>TrueGuard Labs</span></a>
      <div class="foot-koby">
        <!-- TODO: replace this text mark with the Koby logo file (assets/img/koby-logo.png) -->
        <span class="koby-logo" style="color:#fff;font-weight:800;letter-spacing:.06em;font-size:1.3rem">KOBY <small style="font-weight:500;letter-spacing:.3em;font-size:.6rem;color:#c4cee0">SOFT</small></span>
        <p>${f.koby[0]}<span>${f.koby[1]}</span></p>
      </div>
    </div>
    <div class="foot-bottom">
      <div>${f.line}</div>
      <div>${f.rights} <a href="${t.privacyPath}">${f.privacy}</a></div>
    </div>
  </div>
</footer>`;
}

function home(t) {
  const s = t.score, c = t.contact, p = t.problem, m = t.mock, fnd = t.findings;
  const json = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TrueGuard Labs",
    url: SITE,
    logo: `${SITE}/assets/img/logo.png`,
    email: EMAIL,
    telephone: PHONE_TEL,
    description: t.description,
    parentOrganization: { "@type": "Organization", name: "Koby Soft" },
  };
  return `${head(t, `/${t.lang}/`, t.title, t.description)}<script type="application/ld+json">${JSON.stringify(json)}</script>
</head>
<body>
${header(t, `/${t.lang}/`)}
<main id="main">

<section class="hero">
  <div class="wrap">
    <div>
      <span class="eyebrow">${t.eyebrow}</span>
      <h1>${t.h1[0]}<span class="accent">${t.h1[1]}</span></h1>
      <p class="lead">${t.lead}</p>
      <div class="cta-row">
        <a class="btn btn-primary" href="#contact">${t.cta} →</a>
        <a class="btn btn-ghost" href="#verify">${t.seeVerify}</a>
      </div>
    </div>
    <div class="mock" role="img" aria-label="${esc(m.note)}">
      <div class="mock-bar"><span>${m.bar}</span><span class="mock-tag">${m.tag}</span></div>
      <div class="bubble user">${m.user}</div>
      <div class="bubble ai">${m.ai}</div>
      <div class="flag"><b>${m.flag[0]}</b>${m.flag[1]}</div>
      <div class="mock-note">${m.note}</div>
    </div>
  </div>
  <div class="wrap" style="display:block;margin-top:48px">
    <div class="stats">${t.stats.map(([n, l]) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`).join("")}</div>
  </div>
</section>

<section id="problem" class="alt">
  <div class="wrap">
    <div class="section-head"><h2>${p.h[0]}<span class="accent">${p.h[1]}</span></h2><p>${p.p}</p></div>
    <div class="compare">
      <div class="card without"><h3><span class="badge x">✕</span>${p.without}</h3><ul>${p.wo.map((x) => `<li>${x}</li>`).join("")}</ul></div>
      <div class="card with"><h3><span class="badge v">✓</span>${p.withh}</h3><ul>${p.wi.map((x) => `<li>${x}</li>`).join("")}</ul></div>
    </div>
  </div>
</section>

<section id="verify">
  <div class="wrap">
    <div class="section-head"><h2>${t.verify.h}</h2><p>${t.verify.p}</p></div>
    <div class="grid-5">${t.verify.cats.map(([h, d], i) => `<div class="card cat"><span class="n">${String(i + 1).padStart(2, "0")}</span><h3>${h}</h3><p>${d}</p></div>`).join("")}</div>
  </div>
</section>

<section id="findings" class="alt">
  <div class="wrap">
    <div class="section-head"><h2>${fnd.h}</h2><p>${fnd.p}</p></div>
    <div class="card finding">
      <div class="top"><h3>${fnd.title}</h3><span class="sev">${fnd.sev}</span></div>
      <div class="bubble user">${fnd.user}</div>
      <div class="bubble ai">${fnd.ai}</div>
      <div class="callout reality"><b>${fnd.reality[0]}</b>${fnd.reality[1]}</div>
      <div class="callout impact"><b>${fnd.impact[0]}</b>${fnd.impact[1]}</div>
    </div>
  </div>
</section>

<section id="how">
  <div class="wrap">
    <div class="section-head"><h2>${t.how.h}</h2><p>${t.how.p}</p></div>
    <div class="steps">${t.how.steps.map(([h, d], i) => `<div class="step"><div class="num">0${i + 1}</div><h3>${h}</h3><p>${d}</p></div>`).join("")}</div>
  </div>
</section>

<section id="score" class="alt">
  <div class="wrap score-grid">
    <div>
      <h2>${s.h}</h2>
      <p>${s.p}</p>
      <div class="card score-big">
        <span class="example-tag">${s.example}</span>
        <div style="font-size:.78rem;font-weight:700;letter-spacing:.06em;color:var(--muted)">${s.label}</div>
        <div class="num">56<small> / 100</small></div>
        <span class="pill">⚠ ${s.pill}</span>
        <div style="color:var(--muted);font-size:.9rem">${s.pillNote}</div>
      </div>
    </div>
    <div class="card">
      <span class="example-tag">${s.example}</span>
      <ul class="bars">${t.verify.cats.map(([h], i) => `<li><span>${h}</span><span class="track"><span class="fill" style="width:${scores[i]}%;background:${barColor(scores[i])}"></span></span><span class="v">${scores[i]}%</span></li>`).join("")}</ul>
      <div class="legend">${s.legend.map(([col, l]) => `<span><i class="dot" style="background:${col}"></i>${l}</span>`).join("")}</div>
    </div>
  </div>
</section>

<section id="why">
  <div class="wrap">
    <div class="section-head"><h2>${t.why.h}</h2></div>
    <div class="grid-3">${t.why.items.map(([h, d], i) => `<div class="card why"><div class="ico">${["◆", "☰", "◎"][i]}</div><h3>${h}</h3><p>${d}</p></div>`).join("")}</div>
  </div>
</section>

<section id="contact" class="alt">
  <div class="wrap">
    <div class="section-head"><h2>${c.h}</h2><p>${c.p}</p></div>
    <div class="contact-grid">
      <div class="card">
        <form id="contact-form" method="post" action="/api/contact" novalidate>
          <input type="hidden" name="lang" value="${t.lang}">
          <div class="hp" aria-hidden="true"><label>Website<input type="text" name="hp" tabindex="-1" autocomplete="off"></label></div>
          <div class="row2">
            <label>${c.name}<input type="text" name="name" placeholder="${esc(c.namePh)}" required maxlength="120" autocomplete="name"></label>
            <label>${c.company}<input type="text" name="company" placeholder="${esc(c.companyPh)}" maxlength="120" autocomplete="organization"></label>
          </div>
          <label>${c.email}<input type="email" name="email" placeholder="${esc(c.emailPh)}" required maxlength="160" autocomplete="email"></label>
          <div class="row2">
            <label>${c.website}<input type="url" name="website" placeholder="${esc(c.websitePh)}" maxlength="200" autocomplete="url"></label>
            <label>${c.ai}<input type="url" name="ai_url" placeholder="${esc(c.aiPh)}" maxlength="200"></label>
          </div>
          <label>${c.message}<textarea name="message" placeholder="${esc(c.messagePh)}" maxlength="2000"></textarea></label>
          <label class="consent"><input type="checkbox" name="consent" value="yes" required><span>${c.consent[0]}<a href="${t.privacyPath}" target="_blank" rel="noopener">${c.consent[1]}</a>${c.consent[2]}</span></label>
          <button class="btn btn-primary" type="submit" data-sending="${esc(c.sending)}">${c.submit} →</button>
          <div id="form-msg" class="form-msg" role="status" aria-live="polite" data-ok="${esc(c.ok)}" data-err="${esc(c.err)}"></div>
        </form>
      </div>
      <div class="card info-card">
        <h3>${c.infoH}</h3>
        <ul class="info-list">
          <li><small>${c.emailL}</small><a href="mailto:${EMAIL}">${EMAIL}</a></li>
          <li><small>${c.phoneL}</small><a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a></li>
        </ul>
        <a class="btn btn-wa" href="${WA}" target="_blank" rel="noopener">${c.wa}</a>
        <p style="margin:14px 0 0;font-size:.82rem;color:var(--muted)">${c.chooseNote}</p>
      </div>
    </div>
  </div>
</section>

</main>
${footer(t)}
<script src="/assets/js/main.js" defer></script>
</body>
</html>
`;
}

function privacy(t) {
  const p = t.privacy;
  return `${head(t, t.privacyPath, p.title, p.description)}</head>
<body>
${header(t, `/${t.lang}/`)}
<main id="main">
  <div class="wrap doc">
    <p><a href="/${t.lang}/">${p.back}</a></p>
    <div class="draft-note"><strong>${p.draft}</strong></div>
    <h1>${p.h1}</h1>
    ${p.body}
  </div>
</main>
${footer(t)}
</body>
</html>
`;
}

for (const l of ["en", "tr"]) {
  mkdirSync(`${l}/privacy`, { recursive: true });
  writeFileSync(`${l}/index.html`, home(T[l]));
  writeFileSync(`${l}/privacy/index.html`, privacy(T[l]));
}
console.log("built en/ and tr/");
