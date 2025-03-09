// ✅ Initialize Supabase correctly
const supabase = window.supabase.createClient(
  "https://mlwxfbtiqqacqvhwfbtk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sd3hmYnRpcXFhY3F2aHdmYnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzM3MzYsImV4cCI6MjA1NzAwOTczNn0.Q6YD0EtZWITvTAMXFNFysyTFPtDHtD_cMFn_1G8VX4c"
);

// ✅ Load dropdown filters when the page loads
document.addEventListener("DOMContentLoaded", function () {
  loadDegrees();
});

// ✅ Load Degree options from `preloaded_books`
async function loadDegrees() {
  const { data, error } = await supabase.from("preloaded_books").select("degree").order("degree", { ascending: true });

  if (error) {
    console.error("Error fetching degrees:", error);
    return;
  }

  const uniqueDegrees = [...new Set(data.map(book => book.degree))];
  populateDropdown("degree-filter", uniqueDegrees);
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

// ✅ Update Modules when a Degree is selected (Only show modules that have books for sale)
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

  // Fetch all book_ids from `book_listings` that are available for the selected degree
  const { data: listedBooks, error: listingError } = await supabase
    .from("book_listings")
    .select("book_id")
    .eq("status", "Available");

  if (listingError) {
    console.error("Error fetching listed books:", listingError);
    return;
  }

  const bookIdsForSale = listedBooks.map(book => book.book_id);

  // Fetch modules based on selected degree, but only include modules where books are listed for sale
  const { data: books, error } = await supabase
    .from("preloaded_books")
    .select("module, id")
    .eq("degree", selectedDegree)
    .in("id", bookIdsForSale) // Only include books that are for sale
    .order("module", { ascending: true });

  if (error) {
    console.error("Error fetching modules:", error);
    return;
  }

  const uniqueModules = [...new Set(books.map(book => book.module))];
  populateDropdown("module-filter", uniqueModules);
  moduleDropdown.disabled = uniqueModules.length === 0;

  // Show books for the selected degree (from book_listings)
  filterBooks();
}

// ✅ Filter books based on Degree and Module (Using `book_listings`)
async function filterBooks() {
  const selectedDegree = document.getElementById("degree-filter")?.value;
  const selectedModule = document.getElementById("module-filter")?.value;
  const bookListings = document.getElementById("book-listings");

  if (!selectedDegree) {
    bookListings.innerHTML = "";
    return;
  }

  // Get all book_ids for sale
  const { data: listedBooks, error: listingError } = await supabase
    .from("book_listings")
    .select("id, book_id, seller_id, price, condition, issues, status")
    .eq("status", "Available");

  if (listingError) {
    console.error("Error fetching books for sale:", listingError);
    return;
  }

  // Extract book_ids from listed books
  const bookIdsForSale = listedBooks.map(book => book.book_id);

  // Fetch book details from `preloaded_books` (Filtered by Degree & Module)
  let query = supabase.from("preloaded_books").select("id, title, module").eq("degree", selectedDegree).in("id", bookIdsForSale);
  if (selectedModule) query = query.eq("module", selectedModule);

  const { data: books, error } = await query.order("module", { ascending: true });

  if (error) {
    console.error("Error fetching book details:", error);
    return;
  }

  // Clear existing book listings
  bookListings.innerHTML = "";

  // Filter books for sale
  const filteredListings = listedBooks.filter(listing => books.some(book => book.id === listing.book_id));

  if (filteredListings.length === 0) {
    bookListings.innerHTML = "<p>No books available for this selection.</p>";
    return;
  }

  // Generate book cards
  filteredListings.forEach(book => {
    const bookDetails = books.find(b => b.id === book.book_id);
    let card = document.createElement("div");
    card.classList.add("book-card");

    card.innerHTML = `
      <strong class="book-title">${bookDetails.title}</strong>
      <p class="book-module">${bookDetails.module}</p>
      <p class="book-price">R${book.price}</p>
      <p class="book-condition">${book.condition}</p>
      ${book.issues ? `<p class="book-issues">⚠️ ${book.issues.join(', ')}</p>` : ""}
    `;

    bookListings.appendChild(card);
  });
}
