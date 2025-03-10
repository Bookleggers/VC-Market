const supabase = window.supabase.createClient(
  "https://mlwxfbtiqqacqvhwfbtk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sd3hmYnRpcXFhY3F2aHdmYnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzM3MzYsImV4cCI6MjA1NzAwOTczNn0.Q6YD0EtZWITvTAMXFNFysyTFPtDHtD_cMFn_1G8VX4c"
);

let allListings = [];
let currentPage = 1;
let itemsPerPage = 12;

document.addEventListener("DOMContentLoaded", async () => {
  await loadAllListings();
  setupFilters();
  document.getElementById('reset-filters').addEventListener('click', resetFilters);
});

async function loadAllListings() {
  const { data: listings, error } = await supabase
    .from("book_listings")
    .select(`id, price, condition, issues, status, preloaded_books (title, module, degree)`);

  if (error) return console.error(error);
  allListings = listings;
  populateFilters(listings);
  renderListings();
}

function populateFilters(listings) {
  const degreeSet = new Set();
  const moduleSet = new Set();
  const conditionSet = new Set();

  listings.forEach(l => {
    degreeSet.add(l.preloaded_books.degree);
    moduleSet.add(l.preloaded_books.module);
    conditionSet.add(l.condition);
  });

  addOptions('degree-filter', degreeSet);
  addOptions('module-filter', moduleSet);
  const conditionFilter = document.getElementById('condition-filter');
  conditionSet.forEach(cond => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" value="${cond}"> ${cond}`;
    conditionFilter.appendChild(label);
  });
}

function addOptions(id, options) {
  const select = document.getElementById(id);
  Array.from(options).sort().forEach(opt => {
    const option = document.createElement('option');
    option.value = opt;
    option.textContent = opt;
    select.appendChild(option);
  });
}

function resetFilters() {
  document.getElementById('degree-filter').value = '';
  document.getElementById('module-filter').value = '';
  document.querySelectorAll('#condition-filter input').forEach(cb => cb.checked = false);
  document.getElementById('sort-filter').value = '';
  currentPage = 1;
  renderListings();
}

function setupFilters() {
  ['degree-filter', 'module-filter', 'sort-filter', 'items-per-page'].forEach(id => {
    document.getElementById(id).addEventListener('change', renderListings);
  });
  document.getElementById('condition-filter').addEventListener('change', renderListings);
}

function renderListings() {
  const degree = document.getElementById('degree-filter').value;
  const module = document.getElementById('module-filter').value;
  const sort = document.getElementById('sort-filter').value;
  itemsPerPage = parseInt(document.getElementById('items-per-page').value);
  const conditions = Array.from(document.querySelectorAll('#condition-filter input:checked')).map(cb => cb.value);

  let filtered = allListings.filter(l => 
    (!degree || l.preloaded_books.degree === degree) &&
    (!module || l.preloaded_books.module === module) &&
    (conditions.length === 0 || conditions.includes(l.condition))
  );

  filtered = sortListings(filtered, sort);
  paginate(filtered);
}

function sortListings(listings, sort) {
  switch (sort) {
    case 'degree': return listings.sort((a, b) => a.preloaded_books.degree.localeCompare(b.preloaded_books.degree));
    case 'module': return listings.sort((a, b) => a.preloaded_books.module.localeCompare(b.preloaded_books.module));
    case 'book': return listings.sort((a, b) => a.preloaded_books.title.localeCompare(b.preloaded_books.title));
    case 'price-asc': return listings.sort((a, b) => a.price - b.price);
    case 'price-desc': return listings.sort((a, b) => b.price - a.price);
    default: return listings;
  }
}

function paginate(listings) {
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = listings.slice(start, start + itemsPerPage);
  const container = document.getElementById('listings-container');
  container.innerHTML = paginated.map(l => `
    <div class="listing-card">
      <h3>${l.preloaded_books.title}</h3>
      <p><strong>Module:</strong> ${l.preloaded_books.module}</p>
      <p><strong>Degree:</strong> ${l.preloaded_books.degree}</p>
      <p><strong>Price:</strong> R${l.price}</p>
      <p><strong>Condition:</strong> ${l.condition}</p>
    </div>`).join('');

  setupPagination(listings.length);
}
