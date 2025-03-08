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

  // ✅ Password Validation (Only for Sign-Up)
  window.validatePassword = function () {
    const passwordInput = document.getElementById("signup-password");
    const validationContainer = document.getElementById("signup-validation");

    if (!passwordInput || !validationContainer) return;

    validationContainer.style.display = "block"; // Always ensure it's visible on Sign-Up

    const validationRules = {
      uppercase: { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
      lowercase: { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      number: { regex: /[0-9]/, text: "At least 1 number" },
      symbol: { regex: /[^A-Za-z0-9]/, text: "At least 1 symbol" }
    };

    validationContainer.innerHTML = ""; // Clear before updating

    Object.entries(validationRules).forEach(([rule, ruleData]) => {
      const isValid = ruleData.regex.test(passwordInput.value);

      const element = document.createElement("p");
      element.id = `signup-${rule}`;
      element.innerHTML = `<i class="fa-solid ${isValid ? "fa-check" : "fa-xmark"}" style="color: ${
        isValid ? "#34b233" : "#b21807"
      };"></i> <span style="color: ${isValid ? "#34b233" : "#b21807"};">${ruleData.text}</span>`;

      validationContainer.appendChild(element);
    });
  };

  // ✅ Attach Password Validation (Only to Sign-Up)
  const signupPassword = document.getElementById("signup-password");
  if (signupPassword) {
    signupPassword.oninput = function () {
      validatePassword();
    };
  }

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
    document.getElementById("signup-validation").style.display = "none"; // Hide validation on login
  });

  document.getElementById("show-signup").addEventListener("click", function () {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("signup-section").style.display = "block";
    document.getElementById("signup-validation").style.display = "block"; // Show validation on sign-up
  });

  // ✅ Attach Functions to Buttons
  document.getElementById("signup-button").addEventListener("click", signUp);
  document.getElementById("login-button").addEventListener("click", login);
});
