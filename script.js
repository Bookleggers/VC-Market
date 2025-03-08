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

  let fromSignup = false;

  // ✅ Show notification banner
  function showNotification(message, success = true) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.style.backgroundColor = success ? "#28a745" : "#dc3545"; // Green for success, Red for error
    notification.style.display = "block";

    setTimeout(() => {
      notification.style.display = "none";
    }, 4000);
  }

  // ✅ Sign Up Function
  async function signUp() {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    let { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      showNotification(error.message, false);
    } else {
      fromSignup = true;
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
  window.togglePassword = function (fieldId) {
    const passwordField = document.getElementById(fieldId);
    passwordField.type = passwordField.type === "password" ? "text" : "password";
  };

  // ✅ Switch to Login
  document.getElementById("show-login").addEventListener("click", () => {
    document.getElementById("signup-section").style.display = "none";
    document.getElementById("login-section").style.display = "block";
    
    if (!fromSignup) {
      document.getElementById("verification-message").classList.add("hidden");
    }
    document.getElementById("show-signup-container").classList.remove("hidden");
  });

  // ✅ Switch to Sign Up
  document.getElementById("show-signup").addEventListener("click", () => {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("signup-section").style.display = "block";
  });

  // ✅ Attach Functions
  document.getElementById("signup-button").addEventListener("click", signUp);
  document.getElementById("login-button").addEventListener("click", login);
});
