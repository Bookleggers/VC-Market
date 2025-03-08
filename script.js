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

  // ✅ Live Password Validation (Fully Working)
  function validatePassword(inputId, validationPrefix) {
    const password = document.getElementById(inputId).value;

    const validationRules = {
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password)
    };

    Object.keys(validationRules).forEach(rule => {
      const element = document.getElementById(`${validationPrefix}-${rule}`);
      if (!element) return; // Ensure element exists

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
  }

  // ✅ Attach Password Validation to Input Fields
  const signupPassword = document.getElementById("signup-password");
  const loginPassword = document.getElementById("login-password");

  if (signupPassword) {
    signupPassword.addEventListener("input", function () {
      validatePassword("signup-password", "signup");
    });
  }

  if (loginPassword) {
    loginPassword.addEventListener("input", function () {
      validatePassword("login-password", "login");
    });
  }

  // ✅ Sign Up Function
  async function signUp() {
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
  }

  // ✅ Login Function
  async function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    let { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      showNotification(error.message, false);
    } else {
      showNotification(`Logged in as ${data.session.user.email}`);
    }
  }

  // ✅ Toggle Password Visibility
  function togglePassword(fieldId, icon) {
    const passwordField = document.getElementById(fieldId);
    if (!passwordField) return;

    if (passwordField.type === "password") {
      passwordField.type = "text";
      icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      passwordField.type = "password";
      icon.classList.replace("fa-eye-slash", "fa-eye");
    }
  }

  // ✅ Switch Between Sign-Up & Login Pages
  const showLoginBtn = document.getElementById("show-login");
  const showSignupBtn = document.getElementById("show-signup");

  if (showLoginBtn) {
    showLoginBtn.addEventListener("click", function () {
      document.getElementById("signup-section").style.display = "none";
      document.getElementById("login-section").style.display = "block";
      document.getElementById("verification-message").classList.add("hidden");
      document.getElementById("show-signup-container").classList.remove("hidden");
    });
  }

  if (showSignupBtn) {
    showSignupBtn.addEventListener("click", function () {
      document.getElementById("login-section").style.display = "none";
      document.getElementById("signup-section").style.display = "block";
    });
  }

  // ✅ Attach Functions to Buttons
  const signupButton = document.getElementById("signup-button");
  const loginButton = document.getElementById("login-button");

  if (signupButton) {
    signupButton.addEventListener("click", signUp);
  }

  if (loginButton) {
    loginButton.addEventListener("click", login);
  }

  window.togglePassword = togglePassword;
});
