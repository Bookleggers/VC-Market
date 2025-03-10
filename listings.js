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
  document.getElementById('pagination-limit').addEventListener('change', (e) => {
    limit = +e.target.value;
    currentPage = 1;
    displayListings();
  });
  document.getElementById('lightbox-close').addEventListener('click', () => {
    document.getElementById('lightbox').style.display = 'none';
  });
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
  degreeSelect.innerHTML = '<option value="">Filter by Degree</option>';
  degrees.forEach(d => degreeSelect.innerHTML += `<option value="${d}">${d}</option>`);
  degreeSelect.addEventListener('change', displayListings);

  const moduleSelect = document.getElementById('module-filter');
  moduleSelect.innerHTML = '<option value="">Filter by Module</option>';
  modules.forEach(m => moduleSelect.innerHTML += `<option value="${m}">${m}</option>`);
  moduleSelect.addEventListener('change', displayListings);

  const conditionContainer = document.getElementById('condition-container');
  conditionContainer.innerHTML = '';
  conditions.forEach(c => conditionContainer.innerHTML += `<label><input type="checkbox" value="${c}"> ${c}</label>`);
  conditionContainer.querySelectorAll('input').forEach(cb => cb.addEventListener('change', displayListings));

  document.getElementById('sort-filter').addEventListener('change', displayListings);
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

  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((currentPage - 1) * limit, currentPage * limit);

  const container = document.getElementById('listings-container');
  container.innerHTML = '';
  if (paginated.length === 0) {
    container.innerHTML = '<p>No listings match your filters.</p>';
  } else {
    paginated.forEach(listing => {
      const card = document.createElement('div');
      card.className = 'listing-card';
      card.innerHTML = `
        <p><strong>${listing.preloaded_books?.degree}</strong></p>
        <p>${listing.preloaded_books?.module}</p>
        <h3>${listing.preloaded_books?.title}</h3>
        <p>R${listing.price}</p>
      `;
      card.addEventListener('click', () => openLightbox(listing));
      container.appendChild(card);
    });
  }

  const pagination = document.getElementById('pagination-controls');
  pagination.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.addEventListener('click', () => {
      currentPage = i;
      displayListings();
    });
    pagination.appendChild(btn);
  }
}

function openLightbox(listing) {
  const lightbox = document.getElementById('lightbox');
  const details = document.getElementById('lightbox-details');
  details.innerHTML = `
    <h2>${listing.preloaded_books?.title}</h2>
    <p><strong>Degree:</strong> ${listing.preloaded_books?.degree}</p>
    <p><strong>Module:</strong> ${listing.preloaded_books?.module}</p>
    <p><strong>Price:</strong> R${listing.price}</p>
    <p><strong>Condition:</strong> ${listing.condition}</p>
    <p><strong>Issues:</strong> ${Array.isArray(listing.issues) ? listing.issues.join(", ") : "None"}</p>
  `;
  lightbox.style.display = 'flex';
}

function resetFilters() {
  document.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
  document.querySelectorAll('#condition-container input').forEach(cb => cb.checked = false);
  currentPage = 1;
  limit = 36;
  document.getElementById('pagination-limit').value = "36";
  displayListings();
}
