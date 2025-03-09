console.log("Script loaded");

const supabase = window.supabase.createClient(
  "https://mlwxfbtiqqacqvhwfbtk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sd3hmYnRpcXFhY3F2aHdmYnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzM3MzYsImV4cCI6MjA1NzAwOTczNn0.Q6YD0EtZWITvTAMXFNFysyTFPtDHtD_cMFn_1G8VX4c"
);

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  loadAllListings();
});

async function loadAllListings() {
  console.log("Loading all listings...");
  const { data: listings, error: listingsError } = await supabase
    .from("book_listings")
    .select(`
      id, price, condition, issues, status,
      preloaded_books (title, module, degree)
    `);

  console.log("Listings:", listings, "Error:", listingsError);
  if (listingsError) {
    console.error("Error fetching listings:", listingsError);
    return;
  }

  const listingsContainer = document.getElementById("listings-container");
  listingsContainer.innerHTML = "";

  if (!listings || listings.length === 0) {
    listingsContainer.innerHTML = "<p>No listings found.</p>";
    return;
  }

  listings.forEach(listing => {
    const card = document.createElement("div");
    card.classList.add("listing-card");

    card.innerHTML = `
      <h3>${listing.preloaded_books?.title || "Unknown"}</h3>
      <p><strong>Module:</strong> ${listing.preloaded_books?.module || "Unknown"}</p>
      <p><strong>Degree:</strong> ${listing.preloaded_books?.degree || "Unknown"}</p>
      <p><strong>Price:</strong> R${listing.price}</p>
      <p><strong>Condition:</strong> ${listing.condition}</p>
      <p><strong>Issues:</strong> ${Array.isArray(listing.issues) ? listing.issues.join(", ") : "None"}</p>
    `;

    listingsContainer.appendChild(card);
  });
}
