// ✅ Ensure Supabase is loaded before using it
if (typeof supabase === "undefined") {
  var supabase = window.supabase.createClient(
    "https://mlwxfbtiqqacqvhwfbtk.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sd3hmYnRpcXFhY3F2aHdmYnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzM3MzYsImV4cCI6MjA1NzAwOTczNn0.Q6YD0EtZWITvTAMXFNFysyTFPtDHtD_cMFn_1G8VX4c"
  );
}

// ✅ Load dropdown filters for books
async function loadFilters() {
  const { data, error } = await supabase.from("preloaded_books").select("degree, module, title");
  if (error) { console.error("Error fetching books:", error); return; }

  const degreeCounts = {}, moduleCounts = {}, bookCounts = {};

  data.forEach(book => {
    degreeCounts[book.degree] = (degreeCounts[book.degree] || 0) + 1;
    moduleCounts[book.module] = (moduleCounts[book.module] || 0) + 1;
    bookCounts[book.title] = (bookCounts[book.title] || 0) + 1;
  });

  populateDropdown("degree-filter", degreeCounts);
  populateDropdown("module-filter", moduleCounts);
  populateDropdown("book-filter", bookCounts);
}

// ✅ Populate dropdowns dynamically
function populateDropdown(filterId, data) {
  const dropdown = document.getElementById(filterId);
  if (!dropdown) return;

  dropdown.innerHTML = '<option value="">Select</option>'; // Reset dropdown
  Object.entries(data).forEach(([key, count]) => {
    let option = document.createElement("option");
    option.value = key;
    option.textContent = `${key} (${count})`;
    dropdown.appendChild(option);
  });
}

// ✅ Filter books based on selection
async function filterBooks() {
  const selectedDegree = document.getElementById("degree-filter")?.value;
  const selectedModule = document.getElementById("module-filter")?.value;
  const selectedBook = document.getElementById("book-filter")?.value;

  let query = supabase.from("book_listings").select("title, price, condition");
  if (selectedDegree) query = query.eq("degree", selectedDegree);
  if (selectedModule) query = query.eq("module", selectedModule);
  if (selectedBook) query = query.eq("title", selectedBook);

  const { data, error } = await query;
  if (error) { console.error("Error fetching filtered books:", error); return; }

  const listingsContainer = document.getElementById("book-listings");
  if (!listingsContainer) return;

  listingsContainer.innerHTML = ""; // Clear previous listings
  data.forEach(book => {
    let div = document.createElement("div");
    div.classList.add("book-item");
    div.innerHTML = `<strong>${book.title}</strong> - R${book.price} (${book.condition})`;
    listingsContainer.appendChild(div);
  });
}

// ✅ Authentication Functions (Sign-Up, Login)
if (document.getElementById("signup-button")) {
  document.getElementById("signup-button").addEventListener("click", async () => {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    let { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Verification email sent! Please check your inbox.");
  });
}

if (document.getElementById("login-button")) {
  document.getElementById("login-button").addEventListener("click", async () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    let { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else alert(`Logged in as ${data.user.email}`);
  });
}

// ✅ Run filters only on the home page
if (document.getElementById("degree-filter")) {
  window.onload = loadFilters;
}
