document.addEventListener("DOMContentLoaded", async function () {
  if (!window.supabase) {
    console.error("Supabase failed to load.");
    return;
  }

  // Initialize Supabase
  const supabase = window.supabase.createClient(
    "https://mlwxfbtiqqacqvhwfbtk.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sd3hmYnRpcXFhY3F2aHdmYnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzM3MzYsImV4cCI6MjA1NzAwOTczNn0.Q6YD0EtZWITvTAMXFNFysyTFPtDHtD_cMFn_1G8VX4c"
  );

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

  // ✅ Attach Functions
  document.getElementById("signup-button").addEventListener("click", signUp);
  document.getElementById("login-button").addEventListener("click", login);
});
