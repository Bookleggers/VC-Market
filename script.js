// Supabase Initialization
const supabase = window.supabase.createClient(
  "https://mlwxfbtiqqacqvhwfbtk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sd3hmYnRpcXFhY3F2aHdmYnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzM3MzYsImV4cCI6MjA1NzAwOTczNn0.Q6YD0EtZWITvTAMXFNFysyTFPtDHtD_cMFn_1G8VX4c"
);

document.addEventListener("DOMContentLoaded", async function () {
  console.log("DOM fully loaded");
  await checkAuthState();
  loadAllListings();
  setupEventListeners();
});

// ✅ Check if user is logged in
async function checkAuthState() {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    document.getElementById("auth-link").textContent = "Log Out";
    document.getElementById("auth-link").addEventListener("click", logout);
    document.getElementById("user-name").textContent = `Hello, ${user.email.split('@')[0]}`;
    document.getElementById("dashboard-link").style.display = "inline";
  } else {
    document.getElementById("auth-link").textContent = "Login / Sign Up";
    document.getElementById("auth-link").href = "login.html";
  }
}

// ✅ Logout function
async function logout() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}

// ✅ Load Listings (Fixed)
async function loadAllListings() {
  console.log("Loading all listings...");
  const { data: listings, error } = await supabase
    .from("book_listings")
    .select(`
      id, price, condition, issues, allow_counteroffers,
      preloaded_books (title, module, degree)
    `);

  if (error) {
    console.error("Error fetching listings:", error);
    return;
  }

  const container = document.getElementById("listings-container");
  container.innerHTML = "";

  if (!listings.length) {
    container.innerHTML = "<p>No listings available.</p>";
    return;
  }

  listings.forEach(listing => {
    const book = listing.preloaded_books || { title: "Unknown", module: "Unknown", degree: "Unknown" };
    const card = document.createElement("div");
    card.classList.add("listing-card");

    card.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Module:</strong> ${book.module}</p>
      <p><strong>Degree:</strong> ${book.degree}</p>
      <p><strong>Price:</strong> R${listing.price}</p>
      <p><strong>Condition:</strong> ${listing.condition || "Not Specified"}</p>
      <p><strong>Issues:</strong> ${listing.issues ? listing.issues.join(", ") : "None"}</p>
      <button class="offer-button" data-id="${listing.id}">Make an Offer</button>
    `;
    container.appendChild(card);
  });

  document.querySelectorAll(".offer-button").forEach(button => {
    button.addEventListener("click", makeOffer);
  });
}

// ✅ Make Offer Function
async function makeOffer(event) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return alert("You must be logged in to make an offer.");

  const listingId = event.target.dataset.id;
  const offerPrice = prompt("Enter your offer price:");

  if (!offerPrice || isNaN(offerPrice)) return alert("Invalid offer price!");

  const { error } = await supabase.from("offers").insert([
    { listing_id: listingId, buyer_id: user.id, offer_price: parseInt(offerPrice) }
  ]);

  if (error) {
    console.error("Error making offer:", error);
    alert("Failed to make an offer.");
  } else {
    alert("Offer submitted successfully!");
  }
}

// ✅ Sign Up Function
async function signUp() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (!validatePassword(password)) return;

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) return alert("Sign up error: " + error.message);
  alert("Sign up successful! Please check your email to confirm your account.");
}

// ✅ Login Function
async function logIn() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return alert("Login error: " + error.message);
  window.location.href = "index.html";
}

// ✅ Password Validation Function
function validatePassword(password) {
  const validation = document.getElementById("signup-validation");
  const rules = [
    { regex: /[A-Z]/, message: "At least 1 uppercase letter" },
    { regex: /[a-z]/, message: "At least 1 lowercase letter" },
    { regex: /\d/, message: "At least 1 number" },
    { regex: /[^a-zA-Z0-9]/, message: "At least 1 symbol" }
  ];

  validation.innerHTML = "";
  let isValid = true;

  rules.forEach(rule => {
    const passed = rule.regex.test(password);
    const icon = passed ? "✅" : "❌";
    validation.innerHTML += `<p>${icon} ${rule.message}</p>`;
    if (!passed) isValid = false;
  });

  return isValid;
}

// ✅ Dashboard: Load User Listings & Offers
async function loadDashboard() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return window.location.href = "login.html";

  const { data: userListings, error: listingError } = await supabase
    .from("book_listings")
    .select("*")
    .eq("seller_id", user.id);

  const { data: userOffers, error: offerError } = await supabase
    .from("offers")
    .select("listing_id, offer_price, status")
    .eq("buyer_id", user.id);

  if (listingError) console.error(listingError);
  if (offerError) console.error(offerError);

  displayUserListings(userListings);
  displayUserOffers(userOffers);
}

// ✅ Display User Listings
function displayUserListings(listings) {
  const container = document.getElementById("listings-container");
  container.innerHTML = listings.length ? listings.map(listing => `
    <div class="listing-card">
      <h3>${listing.title}</h3>
      <p>Price: R${listing.price}</p>
      <button class="delete-listing" data-id="${listing.id}">Delete</button>
    </div>
  `).join("") : "<p>You have no listings.</p>";

  document.querySelectorAll(".delete-listing").forEach(button => {
    button.addEventListener("click", deleteListing);
  });
}

// ✅ Delete Listing
async function deleteListing(event) {
  const listingId = event.target.dataset.id;
  await supabase.from("book_listings").delete().eq("id", listingId);
  loadDashboard();
}

// ✅ Setup Events
function setupEventListeners() {
  if (document.getElementById("signup-button")) document.getElementById("signup-button").addEventListener("click", signUp);
  if (document.getElementById("login-button")) document.getElementById("login-button").addEventListener("click", logIn);
}
