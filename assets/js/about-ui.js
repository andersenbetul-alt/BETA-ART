/* Naviar Care — contact form validation on the about page. */
(function (window, document) {
  "use strict";

  var form = document.getElementById("contact-form");
  if (!form) return;

  var UI = window.NaviarUI;
  var status = form.querySelector("[data-contact-status]");

  function fieldOf(input) { return input.closest(".field"); }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
  }

  function validate() {
    var ok = true;
    var first = null;

    var inputs = form.querySelectorAll("[required]");
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      var valid = input.value.trim().length > 0;
      if (valid && input.type === "email") valid = isEmail(input.value);

      var field = fieldOf(input);
      if (field) field.classList.toggle("has-error", !valid);
      if (!valid) {
        ok = false;
        if (!first) first = input;
      }
    }

    if (first) first.focus();
    return ok;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validate()) {
      if (status) status.textContent = UI.t("contact.status.invalid", "Please check the highlighted fields.");
      return;
    }
    form.reset();
    if (status) {
      status.textContent = UI.t("contact.status.sent",
        "Thank you — your message has been noted. This demonstration site does not send email, so connect the form to your inbox to go live.");
    }
  });

  /* Clear the error as soon as the visitor starts fixing it. */
  form.addEventListener("input", function (event) {
    var field = event.target.closest && event.target.closest(".field");
    if (field) field.classList.remove("has-error");
  });
})(window, document);
