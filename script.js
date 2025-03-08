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

  let checkInterval;

  // ✅ Check for an existing session
  async function checkAuth() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Auth error:", error.message);
      return;
    }
    if (data.session) {
      document.getElementById("user-info").innerText = `Logged in as ${data.session.user.email}`;
      clearInterval(checkInterval);
    }
  }

  // ✅ Refresh session every 5 seconds to detect email verification
  async function startVerificationCheck() {
    checkInterval = setInterval(async () => {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error("Session refresh error:", error.message);
        return;
      }
      if (data.session && data.session.user.email_confirmed_at) {
        console.log("Email verified, logging in...");
        clearInterval(checkInterval);
        alert("Your email has been verified! Logging you in...");
        document.getElementById("user-info").innerText = `Logged in as ${data.session.user.email}`;
      }
    }, 5000); // Check every 5 seconds
  }

  // ✅ Sign Up Function
  async function signUp() {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    let { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for verification! This page will auto-login when you verify.");
      startVerificationCheck(); // Start auto-login check
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

  // ✅ Start session check when the page loads
  checkAuth();

  // ✅ Attach functions to buttons
  document.getElementById("signup-button").addEventListener("click", signUp);
  document.getElementById("login-button").addEventListener("click", login);
  document.getElementById("logout-button").addEventListener("click", logout);
});
