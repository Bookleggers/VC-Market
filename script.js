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

  // ✅ Make validatePassword globally accessible
  window.validatePassword = function (inputId, validationId) {
    const password = document.getElementById(inputId).value;
    const requirements = {
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password)
    };

    Object.keys(requirements).forEach(key => {
      const element = document.getElementById(`${validationId}-${key}`);
      if (element) {
        const icon = element.querySelector("i");
        if (requirements[key]) {
          icon.classList.replace("fa-xmark", "fa-check");
          icon.style.color = "#34b233"; // Green for valid
        } else {
          icon.classList.replace("fa-check", "fa-xmark");
          icon.style.color = "#b21807"; // Red for invalid
        }
      }
    });
  };

  // ✅ Sign Up Function (Now Global)
  window.signUp = async function () {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    let { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      showNotification(error.message, false);
    } else {
      document.getElementById("signup-section").style.display = "none";
      document.getElementById("login-section").style.display = "block";
      document.getElementById("login-email").value = email;
      document.getElementById("login-password").value = password;
      document.getElementById("verification-message").classList.remove("hidden");
      showNotification("Verification email sent. Please verify and log in.");
    }
  };

  // ✅ Login Function (Now Global)
  window.login = async function () {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    let { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      showNotification(error.message, false);
    } else {
      showNotification(`Logged in as ${data.session.user.email}`);
    }
  };

  // ✅ Toggle Password Visibility (Now Global)
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

  // ✅ Attach Functions to Buttons
  document.getElementById("signup-button").addEventListener("click", signUp);
  document.getElementById("login-button").addEventListener("click", login);
});
