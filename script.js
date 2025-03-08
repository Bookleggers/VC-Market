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

  let signupEmail = "";
  let signupPassword = "";

  // ✅ Check if the user is already logged in (Session 2 - Auto-login after verification)
  async function checkAuth() {
    const { data, error } = await supabase.auth.getSession();
    if (data.session) {
      document.getElementById("user-info").innerText = `Logged in as ${data.session.user.email}`;
      document.getElementById("verification-message").innerText = "Thank you for verifying your email! You are now logged in.";
      document.getElementById("continue-button").style.display = "block"; // Show "Continue" button
    }
  }

  // ✅ Sign Up Function
  async function signUp() {
    signupEmail = document.getElementById("signup-email").value;
    signupPassword = document.getElementById("signup-password").value;

    let { error } = await supabase.auth.signUp({ email: signupEmail, password: signupPassword });

    if (error) {
      alert(error.message);
    } else {
      // ✅ Show verification message & auto-fill login fields
      document.getElementById("signup-section").style.display = "none";
      document.getElementById("login-section").style.display = "block";
      document.getElementById("login-email").value = signupEmail;
      document.getElementById("login-password").value = signupPassword;
    }
  }

  // ✅ Login Function
  async function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    let { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
    } else {
      document.getElementById("user-info").innerText = `Logged in as ${data.session.user.email}`;
    }
  }

  // ✅ Logout Function
  async function logout() {
    await supabase.auth.signOut();
    document.getElementById("user-info").innerText = "Not logged in";
  }

  // ✅ Continue Button (Auto-login in Session 2)
  async function continueAfterVerification() {
    document.getElementById("verification-message").innerText = "Logging you in...";
    await checkAuth(); // Refresh session
  }

  // ✅ Show/hide password toggle
  window.togglePassword = function (fieldId) {
    const passwordField = document.getElementById(fieldId);
    passwordField.type = passwordField.type === "password" ? "text" : "password";
  };

  // ✅ Attach functions to buttons
  document.getElementById("signup-button").addEventListener("click", signUp);
  document.getElementById("login-button").addEventListener("click", login);
  document.getElementById("logout-button").addEventListener("click", logout);
  document.getElementById("continue-button").addEventListener("click", continueAfterVerification);
  document.getElementById("show-login").addEventListener("click", () => {
    document.getElementById("signup-section").style.display = "none";
    document.getElementById("login-section").style.display = "block";
  });

  checkAuth(); // Auto-login check
});
