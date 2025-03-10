const supabase = window.supabase.createClient(
  "https://mlwxfbtiqqacqvhwfbtk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sd3hmYnRpcXFhY3F2aHdmYnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzM3MzYsImV4cCI6MjA1NzAwOTczNn0.Q6YD0EtZWITvTAMXFNFysyTFPtDHtD_cMFn_1G8VX4c"
);


let listings = [];
let currentPage = 1;
let limit = 12;

document.addEventListener("DOMContentLoaded", async () => {
  await loadListings();
  setupFilters();
  document.getElementById('reset-filters').addEventListener('click', resetFilters);
  document.getElementById('pagination-limit').addEventListener('change', (e) => {
    limit = parseInt(e.target.value);
    currentPage = 1;
    displayListings();
  });
});

async function loadListings() {
  const { data, error } = await supabase.from("book_listings").select("id, price, condition, issues, preloaded_books (title, module, degree)");
  if (error) return console.error(error);
  listings = data;
  displayListings();
  populateFilters();
}

function displayListings() {
  const container = document.getElementById('listings-container');
  container.innerHTML = '';
  let filtered = applyFilters();
  let paginated = filtered.slice((currentPage - 1) * limit, currentPage * limit);
  if (paginated.length === 0) {
    container.innerHTML = '<p>No listings match your filters.</p>';
  } else {
    paginated.forEach(listing => {
      const card = document.createElement('div');
      card.className = 'listing-card';
      card.innerHTML = `
        <h3>${listing.preloaded_books?.title}</h3>
        <p><strong>Module:</strong> ${listing.preloaded_books?.module}</p>
        <p><strong>Degree:</strong> ${listing.preloaded_books?.degree}</p>
        <p><strong>Price:</strong> R${listing.price}</p>
        <p><strong>Condition:</strong> ${listing.condition}</p>
        <p><strong>Issues:</strong> ${Array.isArray(listing.issues) ? listing.issues.join(", ") : "None"}</p>
      `;
      container.appendChild(card);
    });
  }
  setupPagination(filtered.length);
}

function populateFilters() {
  const degrees = [...new Set(listings.map(l => l.preloaded_books?.degree).filter(Boolean))].sort();
  const modules = [...new Set(listings.map(l => l.preloaded_books?.module).filter(Boolean))].sort();
  const conditions = [...new Set(listings.map(l => l.condition).filter(Boolean))].sort();

  const degreeSelect = document.getElementById('degree-filter');
  degrees.forEach(d => degreeSelect.innerHTML += `<option value="${d}">${d}</option>`);

  const moduleSelect = document.getElementById('module-filter');
  modules.forEach(m => moduleSelect.innerHTML += `<option value="${m}">${m}</option>`);

  const conditionContainer = document.getElementById('condition-container');
  conditions.forEach(c => conditionContainer.innerHTML += `<label><input type="checkbox" value="${c}"> ${c}</label>`);

  // Hook up event listeners so filters work
  degreeSelect.addEventListener('change', () => { currentPage = 1; displayListings(); });
  moduleSelect.addEventListener('change', () => { currentPage = 1; displayListings(); });
  conditionContainer.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', () => { currentPage = 1; displayListings(); });
  });
  document.getElementById('sort-filter').addEventListener('change', () => { currentPage = 1; displayListings(); });
}

function applyFilters() {
  let degree = document.getElementById('degree-filter').value;
  let module = document.getElementById('module-filter').value;
  let conditions = [...document.querySelectorAll('#condition-container input:checked')].map(i => i.value);
  let sortBy = document.getElementById('sort-filter').value;

  let filtered = listings.filter(l => 
    (!degree || l.preloaded_books?.degree === degree) &&
    (!module || l.preloaded_books?.module === module) &&
    (conditions.length === 0 || conditions.includes(l.condition))
  );

  if (sortBy === "degree") filtered.sort((a, b) => a.preloaded_books.degree.localeCompare(b.preloaded_books.degree));
  else if (sortBy === "module") filtered.sort((a, b) => a.preloaded_books.module.localeCompare(b.preloaded_books.module));
  else if (sortBy === "title") filtered.sort((a, b) => a.preloaded_books.title.localeCompare(b.preloaded_books.title));
  else if (sortBy === "price-asc") filtered.sort((a, b) => a.price - b.price);
  else if (sortBy === "price-desc") filtered.sort((a, b) => b.price - a.price);

  return filtered;
}

function resetFilters() {
  document.querySelectorAll('.filters-container select').forEach(select => select.selectedIndex = 0);
  document.querySelectorAll('#condition-container input').forEach(input => input.checked = false);
  currentPage = 1;
  displayListings();
}

function setupPagination(total) {
  const controls = document.getElementById('pagination-controls');
  controls.innerHTML = '';
  let totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.style.background = '#6a11cb';
    btn.addEventListener('click', () => { currentPage = i; displayListings(); });
    controls.appendChild(btn);
  }
}
