console.log("Script loaded");

const supabase = window.supabase.createClient(
  "https://mlwxfbtiqqacqvhwfbtk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sd3hmYnRpcXFhY3F2aHdmYnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzM3MzYsImV4cCI6MjA1NzAwOTczNn0.Q6YD0EtZWITvTAMXFNFysyTFPtDHtD_cMFn_1G8VX4c"
);

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  loadAllListings();

  if (document.getElementById("signup-button")) {
    document.getElementById("signup-button").addEventListener("click", signUp);
    document.getElementById("login-button").addEventListener("click", logIn);
    document.getElementById("show-login").addEventListener("click", () => {
      document.getElementById("signup-section").style.display = "none";
      document.getElementById("login-section").style.display = "block";
    });
    document.getElementById("show-signup").addEventListener("click", () => {
      document.getElementById("login-section").style.display = "none";
      document.getElementById("signup-section").style.display = "block";
    });
  }
});

async function loadAllListings() {
  console.log("Loading all listings...");
  const { data: listings, error: listingsError } = await supabase
    .from("book_listings")
    .select(`
      id, price, condition, issues, status,
      preloaded_books (title, module, degree)
    `);

  console.log("Listings:", listings, "Error:", listingsError);
  if (listingsError) {
    console.error("Error fetching listings:", listingsError);
    return;
  }

  const tableBody = document.getElementById("listing-table").querySelector("tbody");
  tableBody.innerHTML = "";

  if (!listings || listings.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='6'>No listings found.</td></tr>";
    return;
  }

  listings.forEach(listing => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${listing.preloaded_books?.title || "Unknown"}</td>
      <td>${listing.preloaded_books?.module || "Unknown"}</td>
      <td>${listing.preloaded_books?.degree || "Unknown"}</td>
      <td>R${listing.price}</td>
      <td>${listing.condition || "No info"}</td>
      <td>${Array.isArray(listing.issues) ? listing.issues.join(", ") : "None"}</td>
    `;
    tableBody.appendChild(row);
  });
}

async function signUp() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return alert("Sign up error: " + error.message);
  alert("Sign up successful! Please check your email to confirm your account.");
}

async function logIn() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert("Login error: " + error.message);
  alert("Login successful!");
}
