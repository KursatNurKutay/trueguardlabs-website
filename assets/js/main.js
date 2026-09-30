// Contact form: sends to /api/contact without reloading the page.
(function () {
  var form = document.getElementById("contact-form");
  if (!form) return;
  var msg = document.getElementById("form-msg");
  var btn = form.querySelector("button[type=submit]");
  var label = btn.textContent;

  function show(kind, text) {
    msg.className = "form-msg " + kind;
    msg.textContent = text;
  }

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
      show("ok", msg.getAttribute("data-ok"));
    }).catch(function () {
      show("err", msg.getAttribute("data-err"));
    }).then(function () {
      btn.disabled = false;
      btn.textContent = label;
    });
  });
})();
