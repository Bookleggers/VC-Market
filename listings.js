import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://YOUR_PROJECT_ID.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sd3hmYnRpcXFhY3F2aHdmYnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzM3MzYsImV4cCI6MjA1NzAwOTczNn0.Q6YD0EtZWITvTAMXFNFysyTFPtDHtD_cMFn_1G8VX4c';

const supabase = createClient(supabaseUrl, supabaseKey);

const container = document.getElementById('listings-container');
const degreeFilter = document.getElementById('filter-degree');
const moduleFilter = document.getElementById('filter-module');
const conditionFilter = document.getElementById('filter-condition');

async function fetchListings() {
  const { data, error } = await supabase.from('seller_books').select('*').eq('approved', true);
  if (error) console.error('Error:', error);
  else renderListings(data);
}

function renderListings(listings) {
  container.innerHTML = '';
  listings.forEach(book => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${book.book_title}</h3>
      <p><strong>Module:</strong> ${book.module}</p>
      <p><strong>Degree:</strong> ${book.degree}</p>
      <p><strong>Condition:</strong> ${book.condition}</p>
      <p><strong>Price:</strong> R${book.price}</p>
      <button>View</button>
    `;
    container.appendChild(card);
  });
}

fetchListings();
