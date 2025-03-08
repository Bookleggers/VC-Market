const { createClient } = supabase;

const supabase = createClient(
  "https://mlwxfbtiqqacqvhwfbtk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sd3hmYnRpcXFhY3F2aHdmYnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzM3MzYsImV4cCI6MjA1NzAwOTczNn0.Q6YD0EtZWITvTAMXFNFysyTFPtDHtD_cMFn_1G8VX4c"
);

window.signUp = async function () {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  let { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    alert(error.message);
  } else {
    alert("Check your email for verification!");
  }
};

window.login = async function () {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  let { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert(error.message);
  } else {
    document.getElementById("user-info").innerText = `Logged in as ${data.user.email}`;
  }
};

window.logout = async function () {
  await supabase.auth.signOut();
  document.getElementById("user-info").innerText = "Not logged in";
};

// Check if user is already logged in
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    document.getElementById("user-info").innerText = `Logged in as ${session.user.email}`;
  }
});
