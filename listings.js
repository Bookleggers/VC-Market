console.log("Listings script loaded");

const supabase = window.supabase.createClient(
  "https://mlwxfbtiqqacqvhwfbtk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sd3hmYnRpcXFhY3F2aHdmYnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzM3MzYsImV4cCI6MjA1NzAwOTczNn0.Q6YD0EtZWITvTAMXFNFysyTFPtDHtD_cMFn_1G8VX4c"
);

let allListings = [];
let filteredListings = [];
let currentPage = 1;
let perPage = 12;

document.addEventListener("DOMContentLoaded", async () => {
  await loadListings();
  setupFilters();
});

async function loadListings() {
  const { data, error } = await supabase.from("book_listings").select(`
    id, price, condition, issues, status,
    preloaded_books (title, module, degree)
  `);

  if (error) return console.error(error);

  allListings = data;
  populateDegreeFilter();
  filteredListings = [...allListings];
  renderListings();
}

function populateDegreeFilter() {
  const degrees = [...new Set(allListings.map(l => l.preloaded_books.degree))];
  const degreeSelect = document.getElementById("degree-filter");
  degrees.forEach(degree => {
    const option = document.createElement("option");
    option.value = degree;
    option.textContent = degree;
    degreeSelect.appendChild(option);
  });
}

function setupFilters() {
  document.querySelectorAll("#degree-filter, #module-filter, #sort-filter, #per-page-filter").forEach(el => el.addEventListener("change", applyFilters));
  document.querySelectorAll("#condition-filter input").forEach(cb => cb.addEventListener("change", applyFilters));
  document.getElementById("reset-filters").addEventListener("click", () => {
    document.querySelectorAll("select").forEach(el => el.value = "");
    document.querySelectorAll("#condition-filter input").forEach(cb => cb.checked = false);
    currentPage = 1;
    applyFilters();
  });
}

function applyFilters() {
  const degree = document.getElementById("degree-filter").value;
  const moduleSelect = document.getElementById("module-filter");
  const sort = document.getElementById("sort-filter").value;
  const conditions = [...document.querySelectorAll("#condition-filter input:checked")].map(cb => cb.value);
  perPage = parseInt(document.getElementById("per-page-filter").value);

  let modules = [...new Set(allListings.filter(l => degree === "" || l.preloaded_books.degree === degree).map(l => l.preloaded_books.module))];
  moduleSelect.innerHTML = "<option value=''>All</option>";
  modules.forEach(module => {
    const option = document.createElement("option");
    option.value = module;
    option.textContent = module;
    moduleSelect.appendChild(option);
  });

  const module = moduleSelect.value;
  filteredListings = allListings.filter(l =>
    (degree === "" || l.preloaded_books.degree === degree) &&
    (module === "" || l.preloaded_books.module === module) &&
    (conditions.length === 0 || conditions.includes(l.condition))
  );

  sortListings(sort);
  currentPage = 1;
  renderListings();
}

function sortListings(sort) {
  const compare = (a, b, key) => a[key].localeCompare(b[key]);
  if (sort === "degree") filteredListings.sort((a, b) => compare(a.preloaded_books, b.preloaded_books, "degree"));
  if (sort === "module") filteredListings.sort((a, b) => compare(a.preloaded_books, b.preloaded_books, "module"));
  if (sort === "title") filteredListings.sort((a, b) => compare(a.preloaded_books, b.preloaded_books, "title"));
  if (sort === "price-asc") filteredListings.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filteredListings.sort((a, b) => b.price - a.price);
}

function renderListings() {
  const container = document.getElementById("listings-container");
  container.innerHTML = "";
  const start = (currentPage - 1) * perPage;
  const paginatedListings = filteredListings.slice(start, start + perPage);
  paginatedListings.forEach(l => {
    const card = document.createElement("div");
    card.classList.add("listing-card");
    card.innerHTML = `
      <h3>${l.preloaded_books.title}</h3>
      <p><strong>Module:</strong> ${l.preloaded_books.module}</p>
      <p><strong>Degree:</strong> ${l.preloaded_books.degree}</p>
      <p><strong>Price:</strong> R${l.price}</p>
      <p><strong>Condition:</strong> ${l.condition}</p>
      <p><strong>Issues:</strong> ${Array.isArray(l.issues) ? l.issues.join(", ") : "None"}</p>
    `;
    container.appendChild(card);
  });
  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(filteredListings.length / perPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.classList.add("pagination-btn");
    if (i === currentPage) btn.classList.add("active");
    btn.textContent = i;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderListings();
    });
    pagination.appendChild(btn);
  }
}
