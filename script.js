document.addEventListener("DOMContentLoaded", async function () {
  if (!window.supabase) {
    console.error("Supabase failed to load.");
    return;
  }

  // ✅ Password Validation
  function validatePassword(inputId, validationId) {
    const password = document.getElementById(inputId).value;
    const requirements = {
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password)
    };

    Object.keys(requirements).forEach(key => {
      const element = document.getElementById(`${validationId}-${key}`);
      const icon = element.querySelector("i");
      if (requirements[key]) {
        icon.classList.replace("fa-xmark", "fa-check");
        icon.style.color = "#34b233"; // Green for valid
      } else {
        icon.classList.replace("fa-check", "fa-xmark");
        icon.style.color = "#b21807"; // Red for invalid
      }
    });
  }

  // ✅ Toggle Password Visibility
  window.togglePassword = function (fieldId, icon) {
    const passwordField = document.getElementById(fieldId);
    if (passwordField.type === "password") {
      passwordField.type = "text";
      icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      passwordField.type = "password";
      icon.classList.replace("fa-eye-slash", "fa-eye");
    }
  };
});
