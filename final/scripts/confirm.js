import "./main.js";

const LABELS = {
    name: "Full Name",
    email: "Email",
    phone: "Phone",
    service: "Type of Cleaning",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    sqft: "Approx. Size (sq ft)",
    frequency: "Frequency",
    notes: "Notes",
};

const params = new URLSearchParams(window.location.search);
const summary = document.getElementById("summary");

const rows = Object.entries(LABELS)
    .filter(([key]) => params.get(key))
    .map(([key, label]) => `<dt>${label}</dt><dd>${params.get(key)}</dd>`)
    .join("");

summary.innerHTML = rows
    ? `<dl>${rows}</dl>`
    : `<p class="no-results">No form data was received. Please <a href="quote.html">fill out the quote form</a>.</p>`;
