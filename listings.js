const supabaseUrl = 'https://YOUR_PROJECT_ID.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sd3hmYnRpcXFhY3F2aHdmYnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzM3MzYsImV4cCI6MjA1NzAwOTczNn0.Q6YD0EtZWITvTAMXFNFysyTFPtDHtD_cMFn_1G8VX4c';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const listingsContainer = document.getElementById('listings-container');
const searchInput = document.getElementById('search');
const conditionFilter = document.getElementById('condition-filter');

async function fetchListings() {
  const { data, error } = await supabase.from('seller_books').select('*').eq('approved', true);
  if (error) console.error(error);
  return data || [];
}

function createCard(listing) {
  return `
    <div class="card">
      <h3>${listing.title}</h3>
      <p><strong>Module:</strong> ${listing.module}</p>
      <p><strong>Condition:</strong> ${listing.condition}</p>
      <p><strong>Price:</strong> R${listing.price}</p>
      <button>Buy Now</button>
    </div>
  `;
}

function displayListings(listings) {
  listingsContainer.innerHTML = listings.map(createCard).join('');
}

async function loadListings() {
  const listings = await fetchListings();
  displayListings(listings);

  searchInput.addEventListener('input', () => applyFilters(listings));
  conditionFilter.addEventListener('change', () => applyFilters(listings));
}

function applyFilters(listings) {
  const searchQuery = searchInput.value.toLowerCase();
  const conditionValue = conditionFilter.value;

  const filtered = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery) || listing.module.toLowerCase().includes(searchQuery);
    const matchesCondition = conditionValue ? listing.condition === conditionValue : true;
    return matchesSearch && matchesCondition;
  });

  displayListings(filtered);
}

loadListings();
