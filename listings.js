const supabase = window.supabase.createClient(
  "https://mlwxfbtiqqacqvhwfbtk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sd3hmYnRpcXFhY3F2aHdmYnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzM3MzYsImV4cCI6MjA1NzAwOTczNn0.Q6YD0EtZWITvTAMXFNFysyTFPtDHtD_cMFn_1G8VX4c"
);

document.addEventListener("DOMContentLoaded", function () {
  loadAllListings();
});

async function loadAllListings() {
  const { data: listings, error } = await supabase
    .from("book_listings")
    .select(`
      id, price, condition, issues, status,
      preloaded_books (title, module, degree)
    `);

  if (error) return console.error("Error fetching listings:", error);

  populateFilters(listings);
  renderListings(listings);

  document.getElementById('filter-degree').addEventListener('change', () => applyFilters(listings));
  document.getElementById('filter-module').addEventListener('change', () => applyFilters(listings));
  document.getElementById('filter-condition').addEventListener('change', () => applyFilters(listings));
}

function renderListings(listings) {
  const container = document.getElementById("listings-container");
  container.innerHTML = listings.map(listing => `
    <div class="listing-card">
      <h3>${listing.preloaded_books?.title || "Unknown"}</h3>
      <p><strong>Module:</strong> ${listing.preloaded_books?.module || "Unknown"}</p>
      <p><strong>Degree:</strong> ${listing.preloaded_books?.degree || "Unknown"}</p>
      <p><strong>Price:</strong> R${listing.price}</p>
      <p><strong>Condition:</strong> ${listing.condition}</p>
      <p><strong>Issues:</strong> ${Array.isArray(listing.issues) ? listing.issues.join(", ") : "None"}</p>
    </div>
  `).join('');
}

function populateFilters(listings) {
  const degreeSet = new Set();
  const moduleSet = new Set();

  listings.forEach(l => {
    if (l.preloaded_books?.degree) degreeSet.add(l.preloaded_books.degree);
    if (l.preloaded_books?.module) moduleSet.add(l.preloaded_books.module);
  });

  const degreeFilter = document.getElementById('filter-degree');
  degreeSet.forEach(d => degreeFilter.innerHTML += `<option value="${d}">${d}</option>`);

  const moduleFilter = document.getElementById('filter-module');
  moduleSet.forEach(m => moduleFilter.innerHTML += `<option value="${m}">${m}</option>`);
}

function applyFilters(listings) {
  const selectedDegree = document.getElementById('filter-degree').value;
  const selectedModule = document.getElementById('filter-module').value;
  const selectedCondition = document.getElementById('filter-condition').value;

  const filtered = listings.filter(l =>
    (selectedDegree === '' || l.preloaded_books?.degree === selectedDegree) &&
    (selectedModule === '' || l.preloaded_books?.module === selectedModule) &&
    (selectedCondition === '' || l.condition === selectedCondition)
  );

  renderListings(filtered);
}
