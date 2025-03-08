document.addEventListener("DOMContentLoaded", function () {
  if (!window.supabase) {
    console.error("Supabase failed to load.");
    return;
  }

  // ✅ Initialize Supabase
  const supabase = window.supabase.createClient(
    "https://mlwxfbtiqqacqvhwfbtk.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sd3hmYnRpcXFhY3F2aHdmYnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzM3MzYsImV4cCI6MjA1NzAwOTczNn0.Q6YD0EtZWITvTAMXFNFysyTFPtDHtD_cMFn_1G8VX4c"
  );

  // ✅ Show Notification Banner
  function showNotification(message, success = true) {
    const notification = document.getElementById("notification");
    if (!notification) return;

    notification.textContent = message;
    notification.style.backgroundColor = success ? "#28a745" : "#dc3545"; // Green for success, Red for error
    notification.style.display = "block";

    setTimeout(() => {
      notification.style.display = "none";
    }, 4000);
  }

  // ✅ Live Password Validation (Fixed & Globally Accessible)
  window.validatePassword = function (inputId, validationPrefix) {
    const passwordInput = document.getElementById(inputId);
    if (!passwordInput) return; // Ensure input field exists

    const password = passwordInput.value;

    const validationRules = {
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password)
    };

    Object.keys(validationRules).forEach(rule => {
      const element = document.getElementById(`${validationPrefix}-${rule}`);
      if (!element) return; // Ensure validation element exists

      const icon = element.querySelector("i");
      if (!icon) return; // Ensure icon exists

      if (validationRules[rule]) {
        icon.classList.replace("fa-xmark", "fa-check");
        icon.style.color = "#34b233"; // ✅ Green for valid
      } else {
        icon.classList.replace("fa-check", "fa-xmark");
        icon.style.color = "#b21807"; // ❌ Red for invalid
      }
    });
  };

  // ✅ Attach Password Validation to Input Fields
  document.getElementById("signup-password").oninput = function () {
    validatePassword("signup-password", "signup");
  };

  document.getElementById("login-password").oninput = function () {
    validatePassword("login-password", "login");
  };

  // ✅ Sign Up Function
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

  // ✅ Login Function
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

  // ✅ Toggle Password Visibility
  window.togglePassword = function (fieldId, icon) {
    const passwordField = document.getElementById(fieldId);
    if (!passwordField) return;

    if (passwordField.type === "password") {
      passwordField.type = "text";
      icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      passwordField.type = "password";
      icon.classList.replace("fa-eye-slash", "fa-eye");
    }
  };

  // ✅ Switch Between Sign-Up & Login Pages
  document.getElementById("show-login").addEventListener("click", function () {
    document.getElementById("signup-section").style.display = "none";
    document.getElementById("login-section").style.display = "block";
    document.getElementById("verification-message").classList.add("hidden");
    document.getElementById("show-signup-container").classList.remove("hidden");
  });

  document.getElementById("show-signup").addEventListener("click", function () {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("signup-section").style.display = "block";
  });

  // ✅ Attach Functions to Buttons
  document.getElementById("signup-button").addEventListener("click", signUp);
  document.getElementById("login-button").addEventListener("click", login);
});
