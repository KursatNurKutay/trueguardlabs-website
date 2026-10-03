/*
 * Koby Soft — minimal cookie consent banner (analytics only).
 *
 * Works together with the tiny inline "consent default" snippet that sits in
 * <head> BEFORE the Google Tag Manager snippet. That snippet sets Google
 * Consent Mode to "denied" by default (and restores an earlier "accepted"
 * choice). This file shows the banner, stores the visitor's choice in
 * localStorage and tells Google about it.
 *
 * Config (attributes on the <script> tag):
 *   data-privacy-tr    link to the Turkish privacy / cookie page (optional)
 *   data-privacy-en    link to the English privacy / cookie page (optional)
 *   data-footer-link   "off" = do not auto-add a "Cookie settings" link to the
 *                      <footer> (the page provides its own and calls
 *                      window.kobyCookieSettings())
 *
 * Language: <html lang="tr..."> => Turkish, anything else => English.
 */
(function () {
  'use strict';

  var KEY = 'cookie_consent_v1';
  var script = document.currentScript;
  var cfg = {
    tr: script && script.getAttribute('data-privacy-tr'),
    en: script && script.getAttribute('data-privacy-en'),
    footerLink: !(script && script.getAttribute('data-footer-link') === 'off')
  };

  var TEXT = {
    tr: {
      title: 'Çerez tercihleriniz',
      body: 'Bu site, kaç kişinin ziyaret ettiğini ve hangi sayfaların kullanıldığını anlamak için analitik çerezler kullanır. Bunları yalnızca onay verirseniz etkinleştiririz.',
      accept: 'Kabul et',
      decline: 'Reddet',
      more: 'Gizlilik ve çerez bilgileri',
      settings: 'Çerez tercihleri'
    },
    en: {
      title: 'Your cookie choices',
      body: 'We use analytics cookies to understand how many people visit and which pages they use. We only turn them on if you accept.',
      accept: 'Accept',
      decline: 'Decline',
      more: 'Privacy and cookie information',
      settings: 'Cookie settings'
    }
  };

  function lang() {
    var l = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    return l.indexOf('tr') === 0 ? 'tr' : 'en';
  }

  function read() {
    try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(v) {
    try { window.localStorage.setItem(KEY, v); } catch (e) {}
  }

  function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  function apply(choice) {
    gtag('consent', 'update', {
      analytics_storage: choice === 'accepted' ? 'granted' : 'denied'
    });
  }

  var CSS =
    '#kcc-banner{position:fixed;left:16px;right:16px;bottom:16px;max-width:440px;z-index:2147483000;' +
    'background:#fff;color:#14213d;border:1px solid rgba(20,33,61,.15);border-radius:12px;' +
    'box-shadow:0 10px 40px rgba(0,0,0,.25);padding:18px 20px;font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}' +
    '#kcc-banner *{box-sizing:border-box}' +
    '#kcc-banner .kcc-t{font-weight:700;font-size:15px;margin:0 0 6px}' +
    '#kcc-banner p{margin:0 0 8px;color:#33405c}' +
    '#kcc-banner a{color:#14213d;text-decoration:underline}' +
    '#kcc-banner .kcc-r{display:flex;gap:10px;margin-top:12px}' +
    '#kcc-banner button{flex:1;cursor:pointer;font:inherit;font-weight:600;padding:10px 14px;border-radius:8px;' +
    'border:2px solid #14213d;background:#fff;color:#14213d}' +
    '#kcc-banner button.kcc-a{background:#14213d;color:#fff}' +
    '#kcc-banner button:focus-visible,#kcc-banner a:focus-visible{outline:3px solid #2f6fed;outline-offset:2px}' +
    '@media(min-width:600px){#kcc-banner{left:20px;right:auto;bottom:20px}}' +
    '.kcc-settings{background:none;border:0;padding:0;margin:0;font:inherit;color:inherit;text-decoration:underline;cursor:pointer;opacity:.85}';

  function addStyle() {
    if (document.getElementById('kcc-style')) return;
    var s = document.createElement('style');
    s.id = 'kcc-style';
    s.appendChild(document.createTextNode(CSS));
    document.head.appendChild(s);
  }

  function buildBanner() {
    var t = TEXT[lang()];
    var link = cfg[lang()] || cfg.en || cfg.tr;
    var b = document.createElement('div');
    b.id = 'kcc-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-live', 'polite');
    b.setAttribute('aria-label', t.title);

    var h = document.createElement('p');
    h.className = 'kcc-t';
    h.textContent = t.title;
    b.appendChild(h);

    var p = document.createElement('p');
    p.textContent = t.body;
    b.appendChild(p);

    if (link) {
      var lp = document.createElement('p');
      var a = document.createElement('a');
      a.href = link;
      a.textContent = t.more;
      lp.appendChild(a);
      b.appendChild(lp);
    }

    var row = document.createElement('div');
    row.className = 'kcc-r';
    var no = document.createElement('button');
    no.type = 'button';
    no.textContent = t.decline;
    no.addEventListener('click', function () { choose('declined'); });
    var yes = document.createElement('button');
    yes.type = 'button';
    yes.className = 'kcc-a';
    yes.textContent = t.accept;
    yes.addEventListener('click', function () { choose('accepted'); });
    row.appendChild(no);
    row.appendChild(yes);
    b.appendChild(row);
    return b;
  }

  function removeBanner() {
    var old = document.getElementById('kcc-banner');
    if (old && old.parentNode) old.parentNode.removeChild(old);
  }

  function show() {
    addStyle();
    removeBanner();
    document.body.appendChild(buildBanner());
  }

  function choose(choice) {
    write(choice);
    apply(choice);
    removeBanner();
  }

  function addFooterLink() {
    if (!cfg.footerLink || document.getElementById('kcc-footer-link')) return;
    var footer = document.querySelector('footer');
    if (!footer) return;
    addStyle();
    var wrap = document.createElement('div');
    wrap.id = 'kcc-footer-link';
    wrap.style.cssText = 'text-align:center;padding:8px 16px 14px;font-size:13px';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'kcc-settings';
    btn.textContent = TEXT[lang()].settings;
    btn.addEventListener('click', show);
    wrap.appendChild(btn);
    footer.appendChild(wrap);
  }

  function refreshLanguage() {
    var btn = document.querySelector('#kcc-footer-link .kcc-settings');
    if (btn) btn.textContent = TEXT[lang()].settings;
    if (document.getElementById('kcc-banner')) show();
  }

  function init() {
    addFooterLink();
    if (!read()) show();
    if (window.MutationObserver) {
      new MutationObserver(refreshLanguage).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['lang']
      });
    }
  }

  window.kobyCookieSettings = function () {
    if (document.body) show();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
