/* ✅ Reset & Base */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
}

body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8f9fa, #e3e6ea);
  color: #222;
}

/* ✅ Header - Lovable Style */
.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 40px;
  background: rgb(4, 5, 6);
  color: rgb(244, 244, 245);
  width: 100%;
  height: 64px;
}

.logo-section .logo {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

/* Centered Navigation */
.main-nav {
  display: flex;
  gap: 32px;
}

.main-nav a {
  color: rgb(244, 244, 245);
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  padding: 8px;
  transition: opacity 0.2s ease;
}

.main-nav a:hover {
  opacity: 0.7;
}

/* Login & Sign up Buttons */
.auth-buttons {
  display: flex;
  gap: 10px;
}

.btn-signin, .btn-signup {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.btn-signin {
  background: rgb(39, 39, 42);
  color: rgb(244, 244, 245);
  border: 1px solid rgb(63, 63, 70);
  box-shadow: rgba(0, 0, 0, 0.05) 0 1px 2px 0;
}

.btn-signin:hover {
  background: rgb(63, 63, 70);
}

.btn-signup {
  background: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: rgba(0, 0, 0, 0.05) 0 1px 2px 0;
}

.btn-signup:hover {
  background: rgb(244, 244, 245);
}

/* ✅ Listings Section */
#listings-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Individual Listing Card */
.listing-card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding: 20px;
  box-shadow: rgba(0, 0, 0, 0.05) 0 2px 4px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.listing-card:hover {
  transform: translateY(-4px);
  box-shadow: rgba(0, 0, 0, 0.08) 0 4px 8px;
}

.listing-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
}

.listing-card p {
  font-size: 14px;
  color: #333;
  margin: 3px 0;
}

/* Offer Button */
.offer-button {
  margin-top: auto;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: #0071e3;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
  font-size: 14px;
}

.offer-button:hover {
  background: #005bb5;
}

/* ✅ Footer */
footer {
  text-align: center;
  padding: 20px 0;
  background: #222;
  color: white;
  width: 100%;
  margin-top: auto;
  font-size: 14px;
}
