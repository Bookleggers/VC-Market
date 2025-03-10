const supabase = window.supabase.createClient(
  "https://mlwxfbtiqqacqvhwfbtk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sd3hmYnRpcXFhY3F2aHdmYnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzM3MzYsImV4cCI6MjA1NzAwOTczNn0.Q6YD0EtZWITvTAMXFNFysyTFPtDHtD_cMFn_1G8VX4c"
);

let listings = [];
let currentPage = 1;
let limit = 36;

document.addEventListener("DOMContentLoaded", async () => {
  await loadListings();
  document.getElementById('reset-filters').addEventListener('click', resetFilters);
  document.getElementById('pagination-limit').addEventListener('change', (e) => { limit = +e.target.value; currentPage = 1; displayListings(); });
});

async function loadListings() {
  const { data, error } = await supabase.from("book_listings").select("id, price, condition, issues, preloaded_books (title, module, degree)");
  if (error) return console.error(error);
  listings = data;
  displayListings();
  populateFilters();
}

function populateFilters() {
  const degrees = [...new Set(listings.map(l => l.preloaded_books?.degree).filter(Boolean))].sort();
  const modules = [...new Set(listings.map(l => l.preloaded_books?.module).filter(Boolean))].sort();
  const conditions = [...new Set(listings.map(l => l.condition).filter(Boolean))].sort();

  const degreeSelect = document.getElementById('degree-filter');
  degrees.forEach(d => degreeSelect.innerHTML += `<option value="${d}">${d}</option>`);
  degreeSelect.addEventListener('change', displayListings);

  const moduleSelect = document.getElementById('module-filter');
  modules.forEach(m => moduleSelect.innerHTML += `<option value="${m}">${m}</option>`);
  moduleSelect.addEventListener('change', displayListings);

  const conditionContainer = document.getElementById('condition-container');
  conditions.forEach(c => conditionContainer.innerHTML += `<label><input type="checkbox" value="${c}"> ${c}</label>`);
  conditionContainer.querySelectorAll('input').forEach(cb => cb.addEventListener('change', displayListings));

  document.getElementById('sort-filter').addEventListener('change', displayListings);
}

function resetFilters() {
  document.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
  document.querySelectorAll('#condition-container input').forEach(cb => cb.checked = false);
  currentPage = 1;
  limit = 36;
  displayListings();
}

function displayListings() {
  const degree = document.getElementById('degree-filter').value;
  const module = document.getElementById('module-filter').value;
  const conditions = [...document.querySelectorAll('#condition-container input:checked')].map(c => c.value);
  const sort = document.getElementById('sort-filter').value;

  let filtered = listings.filter(l =>
    (!degree || l.preloaded_books?.degree === degree) &&
    (!module || l.preloaded_books?.module === module) &&
    (conditions.length === 0 || conditions.includes(l.condition))
  );

  if (sort === 'degree') filtered.sort((a, b) => a.preloaded_books.degree.localeCompare(b.preloaded_books.degree));
  else if (sort === 'module') filtered.sort((a, b) => a.preloaded_books.module.localeCompare(b.preloaded_books.module));
  else if (sort === 'title') filtered.sort((a, b) => a.preloaded_books.title.localeCompare(b.preloaded_books.title));
  else if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);

  renderCards(filtered);
}

function renderCards(data) { /* I'll give this in next message if needed */ }
