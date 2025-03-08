// ✅ Initialize Supabase correctly
const supabase = window.supabase.createClient(
  "https://mlwxfbtiqqacqvhwfbtk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sd3hmYnRpcXFhY3F2aHdmYnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzM3MzYsImV4cCI6MjA1NzAwOTczNn0.Q6YD0EtZWITvTAMXFNFysyTFPtDHtD_cMFn_1G8VX4c"
);

// ✅ Load books when the page loads
document.addEventListener("DOMContentLoaded", function () {
  loadBooks();
});

// ✅ Fetch books from Supabase and display in table
async function loadBooks() {
  const { data, error } = await supabase.from("preloaded_books").select("title, module, degree, new_price");
  
  if (error) {
    console.error("Error fetching books:", error);
    return;
  }

  const tableBody = document.querySelector("#books-table tbody");
  tableBody.innerHTML = ""; // Clear existing data

  data.forEach(book => {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.module}</td>
      <td>${book.degree}</td>
      <td>R${book.new_price}</td>
    `;
    tableBody.appendChild(row);
  });
}
