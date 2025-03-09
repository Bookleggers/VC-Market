const supabase = window.supabase.createClient(
  "https://mlwxfbtiqqacqvhwfbtk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sd3hmYnRpcXFhY3F2aHdmYnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzM3MzYsImV4cCI6MjA1NzAwOTczNn0.Q6YD0EtZWITvTAMXFNFysyTFPtDHtD_cMFn_1G8VX4c"
);

document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("degree-filter")) loadDegrees();
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

async function loadDegrees() {
  const { data, error } = await supabase.from("preloaded_books")
    .select("degree")
    .order("degree", { ascending: true });
  if (error) return console.error(error);
  const uniqueDegrees = [...new Set(data.map(book => book.degree))];
  populateDropdown("degree-filter", uniqueDegrees);
}

function populateDropdown(filterId, dataSet) {
  const dropdown = document.getElementById(filterId);
  if (!dropdown) return;
  dropdown.innerHTML = '<option value="">Select</option>';
  dataSet.forEach(value => {
    let option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    dropdown.appendChild(option);
  });
}

async function updateModules() {
  const selectedDegree = document.getElementById("degree-filter")?.value;
  const moduleDropdown = document.getElementById("module-filter");
  const bookListings = document.getElementById("book-listings");
  if (!selectedDegree) {
    moduleDropdown.innerHTML = '<option value="">Select Module</option>';
    moduleDropdown.disabled = true;
    bookListings.innerHTML = "";
    return;
  }
  const { data: listedBooks, error: listingError } = await supabase
    .from("book_listings")
    .select("book_id")
    .eq("status", "Available");
  if (listingError) return console.error(listingError);
  const bookIdsForSale = listedBooks.map(book => book.book_id);
  const { data: books, error } = await supabase
    .from("preloaded_books")
    .select("module, id")
    .eq("degree", selectedDegree)
    .in("id", bookIdsForSale)
    .order("module", { ascending: true });
  if (error) return console.error(error);
  const uniqueModules = [...new Set(books.map(book => book.module))];
  populateDropdown("module-filter", uniqueModules);
  moduleDropdown.disabled = uniqueModules.length === 0;
  filterBooks();
}

async function filterBooks() {
  const selectedDegree = document.getElementById("degree-filter")?.value;
  const selectedModule = document.getElementById("module-filter")?.value;
  const bookListings = document.getElementById("book-listings");
  if (!selectedDegree) {
    bookListings.innerHTML = "";
    return;
  }
  const { data: listedBooks, error: listingError } = await supabase
    .from("book_listings")
    .select("id, book_id, seller_id, price, condition, issues, status")
    .eq("status", "Available");
  if (listingError) return console.error(listingError);
  const bookIdsForSale = listedBooks.map(book => book.book_id);
  let query = supabase
    .from("preloaded_books")
    .select("id, title, module")
    .eq("degree", selectedDegree)
    .in("id", bookIdsForSale);
  if (selectedModule) query = query.eq("module", selectedModule);
  const { data: books, error } = await query.order("module", { ascending: true });
  if (error) return console.error(error);
  bookListings.innerHTML = "";
  const filteredListings = listedBooks.filter(listing => books.some(book => book.id === listing.book_id));
  if (filteredListings.length === 0) {
    bookListings.innerHTML = "<p>No books available for this selection.</p>";
    return;
  }
  filteredListings.forEach(book => {
    const bookDetails = books.find(b => b.id === book.book_id);
    let card = document.createElement("div");
    card.classList.add("book-card");
    card.innerHTML = `
      <strong class="book-title">${bookDetails.title}</strong>
      <p class="book-module">${bookDetails.module}</p>
      <p class="book-price">R${book.price}</p>
      <p class="book-condition">${book.condition || "No condition info"}</p>
      ${book.issues ? `<p class="book-issues">⚠️ ${book.issues.join(', ')}</p>` : ""}
    `;
    bookListings.appendChild(card);
  });
}

async function signUp() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const { error, data } = await supabase.auth.signUp({ email, password });
  if (error) return alert("Sign up error: " + error.message);
  alert("Sign up successful! Please check your email to confirm your account.");
}

async function logIn() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const { error, data } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert("Login error: " + error.message);
  alert("Login successful!");
}
