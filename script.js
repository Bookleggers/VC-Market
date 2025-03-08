// ✅ Initialize Supabase correctly
const supabase = window.supabase.createClient(
  "https://mlwxfbtiqqacqvhwfbtk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sd3hmYnRpcXFhY3F2aHdmYnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzM3MzYsImV4cCI6MjA1NzAwOTczNn0.Q6YD0EtZWITvTAMXFNFysyTFPtDHtD_cMFn_1G8VX4c"
);

// ✅ Load dropdown filters for books when the page loads
document.addEventListener("DOMContentLoaded", function () {
  loadDegrees();
});

// ✅ Load Degree options from Supabase
async function loadDegrees() {
  const { data, error } = await supabase.from("preloaded_books").select("degree").order("degree", { ascending: true });

  if (error) {
    console.error("Error fetching degrees:", error);
    return;
  }

  const uniqueDegrees = [...new Set(data.map(book => book.degree))]; // Remove duplicates
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

// ✅ Update Modules when a Degree is selected
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

  // Fetch modules based on selected degree
  const { data, error } = await supabase
    .from("preloaded_books")
    .select("module")
    .eq("degree", selectedDegree)
    .order("module", { ascending: true });

  if (error) {
    console.error("Error fetching modules:", error);
    return;
  }

  const uniqueModules = [...new Set(data.map(book => book.module))]; // Remove duplicates
  populateDropdown("module-filter", uniqueModules);
  moduleDropdown.disabled = uniqueModules.length === 0;

  // Show books for the selected degree
  filterBooks();
}

// ✅ Filter books based on Degree and Module
async function filterBooks() {
  const selectedDegree = document.getElementById("degree-filter")?.value;
  const selectedModule = document.getElementById("module-filter")?.value;
  const bookListings = document.getElementById("book-listings");

  if (!selectedDegree) {
    bookListings.innerHTML = "";
    return;
  }

  let query = supabase.from("preloaded_books").select("title, price, module, issues").eq("degree", selectedDegree);
  if (selectedModule) query = query.eq("module", selectedModule);

  const { data, error } = await query.order("module", { ascending: true }).order("title", { ascending: true });

  if (error) {
    console.error("Error fetching books:", error);
    return;
  }

  // Clear existing books
  bookListings.innerHTML = "";

  // Generate book cards
  data.forEach(book => {
    let card = document.createElement("div");
    card.classList.add("book-card");

    card.innerHTML = `
      <strong class="book-title">${book.title}</strong>
      <p class="book-price">R${book.price}</p>
      ${book.issues ? `<p class="book-issues">⚠️ ${book.issues}</p>` : ""}
      <p class="book-module">${book.module}</p>
    `;

    bookListings.appendChild(card);
  });
}
