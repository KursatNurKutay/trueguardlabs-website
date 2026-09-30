// TrueGuard Labs: menu, scroll effects, hero demo and contact form. No external libraries.
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mobile menu
  var burger = document.querySelector(".burger");
  var nav = document.getElementById("site-nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
    });
  }

  // Reveal on scroll (also starts the score bars filling)
  var revealEls = document.querySelectorAll(".reveal, .bars");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // Count-up numbers
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (reduce || !("IntersectionObserver" in window)) { el.textContent = target; return; }
    var seen = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      seen.disconnect();
      var start = null;
      (function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / 1100, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    }, { threshold: 0.4 });
    seen.observe(el);
  });

  // Soft glow that follows the pointer over cards
  document.querySelectorAll(".glow").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  // Active menu link while scrolling
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav a[href*='#']"));
  if (links.length && "IntersectionObserver" in window) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").split("#")[1]] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          links.forEach(function (a) { a.classList.remove("active"); });
          map[en.target.id].classList.add("active");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  // Hero demo: cycles through the illustrative audit scenes
  var slides = document.querySelectorAll(".slide");
  var dots = document.querySelectorAll(".dots button");
  var current = 0, timer = null;
  function show(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle("active", k === current); });
    dots.forEach(function (d, k) { d.classList.toggle("active", k === current); d.setAttribute("aria-current", k === current ? "true" : "false"); });
  }
  function play() { if (!reduce && slides.length > 1) { stop(); timer = setInterval(function () { show(current + 1); }, 5500); } }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  if (slides.length) {
    dots.forEach(function (d, k) { d.addEventListener("click", function () { show(k); play(); }); });
    var laptop = document.querySelector(".laptop");
    if (laptop) { laptop.addEventListener("mouseenter", stop); laptop.addEventListener("mouseleave", play); }
    show(0); play();
  }

  // Contact form
  var form = document.getElementById("contact-form");
  if (!form) return;
  var msg = document.getElementById("form-msg");
  var btn = form.querySelector("button[type=submit]");
  var label = btn.textContent;
  function say(kind, text) { msg.className = "form-msg " + kind; msg.textContent = text; }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    btn.disabled = true;
    btn.textContent = btn.getAttribute("data-sending");
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data)
    }).then(function (r) {
      if (!r.ok) throw new Error("bad status " + r.status);
      form.reset();
      say("ok", msg.getAttribute("data-ok"));
    }).catch(function () {
      say("err", msg.getAttribute("data-err"));
    }).then(function () { btn.disabled = false; btn.textContent = label; });
  });
})();
