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
    .select("*");

  if (error) return console.error(error);
  
  const container = document.getElementById("listings-container");
  container.innerHTML = listings.map(listing => `
    <div class="listing-card">
      <h3>${listing.title}</h3>
      <p>Price: R${listing.price}</p>
    </div>
  `).join("");
}
