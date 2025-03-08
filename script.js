// ✅ Initialize Supabase correctly
const supabase = window.supabase.createClient(
  "https://mlwxfbtiqqacqvhwfbtk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sd3hmYnRpcXFhY3F2aHdmYnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzM3MzYsImV4cCI6MjA1NzAwOTczNn0.Q6YD0EtZWITvTAMXFNFysyTFPtDHtD_cMFn_1G8VX4c"
);

// ✅ Load dropdown filters for books when the page loads
document.addEventListener("DOMContentLoaded", function () {
  loadFilters();
});

// ✅ Load dropdown options from Supabase
async function loadFilters() {
  if (!supabase) {
    console.error("Supabase is not initialized!");
    return;
  }

  // Fetch data from Supabase
  const { data, error } = await supabase.from("preloaded_books").select("degree, module, title");
  if (error) {
    console.error("Error fetching books:", error);
    return;
  }

  // Ensure data is received
  if (!data || data.length === 0) {
    console.warn("No data found in preloaded_books");
    return;
  }

  // Use sets to avoid duplicates
  const degrees = new Set();
  const modules = new Set();
  const books = new Set();

  data.forEach(book => {
    if (book.degree) degrees.add(book.degree);
    if (book.module) modules.add(book.module);
    if (book.title) books.add(book.title);
  });

  // Populate dropdowns
  populateDropdown("degree-filter", degrees);
  populateDropdown("module-filter", modules);
  populateDropdown("book-filter", books);
}

// ✅ Populate dropdowns dynamically
function populateDropdown(filterId, dataSet) {
  const dropdown = document.getElementById(filterId);
  if (!dropdown) return;

  dropdown.innerHTML = '<option value="">Select</option>'; // Reset dropdown

  dataSet.forEach(value => {
    let option = document.createElement("option");
    option.value = value;
    option.textContent = value;
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
  if (error) {
    console.error("Error fetching filtered books:", error);
    return;
  }

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
