// Load Supabase SDK
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase
const SUPABASE_URL = "https://mlwxfbtiqqacqvhwfbtk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sd3hmYnRpcXFhY3F2aHdmYnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzM3MzYsImV4cCI6MjA1NzAwOTczNn0.Q6YD0EtZWITvTAMXFNFysyTFPtDHtD_cMFn_1G8VX4c";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Sign Up Function
async function signUp() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  let { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    alert(error.message);
  } else {
    alert("Check your email for verification!");
  }
}

// Login Function
async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  let { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert(error.message);
  } else {
    document.getElementById("user-info").innerText = `Logged in as ${data.user.email}`;
  }
}

// Logout Function
async function logout() {
  await supabase.auth.signOut();
  document.getElementById("user-info").innerText = "Not logged in";
}

// Handle Auth State Change
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    document.getElementById("user-info").innerText = `Logged in as ${session.user.email}`;
  }
});

// Attach functions to buttons
document.getElementById("signup-button").addEventListener("click", signUp);
document.getElementById("login-button").addEventListener("click", login);
document.getElementById("logout-button").addEventListener("click", logout);
