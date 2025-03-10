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
  document.getElementById('pagination-limit').addEventListener('change', e => { limit = parseInt(e.target.value); displayListings(); });
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
  setupPagination(filtered.length);
}

function populateFilters() {
  const degrees = [...new Set(listings.map(l => l.preloaded_books?.degree))].sort();
  const modules = [...new Set(listings.map(l => l.preloaded_books?.module))].sort();
  const conditions = [...new Set(listings.map(l => l.condition))].sort();

  const degreeSelect = document.getElementById('degree-filter');
  degrees.forEach(d => degreeSelect.innerHTML += `<option value="${d}">${d}</option>`);

  const moduleSelect = document.getElementById('module-filter');
  modules.forEach(m => moduleSelect.innerHTML += `<option value="${m}">${m}</option>`);

  const conditionContainer = document.getElementById('condition-container');
  conditions.forEach(c => conditionContainer.innerHTML += `<label><input type="checkbox" value="${c}"> ${c}</label>`);
}

function applyFilters() {
  let degree = document.getElementById('degree-filter').value;
  let module = document.getElementById('module-filter').value;
  let conditions = [...document.querySelectorAll('#condition-container input:checked')].map(i => i.value);
  return listings.filter(l => (!degree || l.preloaded_books?.degree === degree) && (!module || l.preloaded_books?.module === module) && (conditions.length === 0 || conditions.includes(l.condition)));
}

function resetFilters() {
  document.querySelectorAll('.filters-container select').forEach(select => select.value = '');
  document.querySelectorAll('#condition-container input').forEach(input => input.checked = false);
  displayListings();
}

function setupPagination(total) {
  const controls = document.getElementById('pagination-controls');
  controls.innerHTML = '';
}
