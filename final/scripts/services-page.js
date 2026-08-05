import "./main.js";
import { getServices, getFavorites, toggleFavorite } from "./services.mjs";

const cardsEl = document.getElementById("service-cards");
const categoriesEl = document.getElementById("categories");
const countEl = document.getElementById("result-count");
const modal = document.getElementById("service-modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");

let allServices = [];
let activeCategory = "All";

function renderCategories() {
    const categories = ["All", ...new Set(allServices.map((s) => s.category))];
    categoriesEl.innerHTML = categories
        .map((c) => `<button class="chip ${c === activeCategory ? "selected" : ""}" data-category="${c}">${c}</button>`)
        .join("");
}

function render() {
    const favs = getFavorites();
    const filtered = allServices.filter((s) => activeCategory === "All" || s.category === activeCategory);
    countEl.textContent = `${filtered.length} service${filtered.length === 1 ? "" : "s"} shown`;

    if (filtered.length === 0) {
        cardsEl.innerHTML = `<p class="no-results">No services in this category.</p>`;
        return;
    }

    cardsEl.innerHTML = filtered
        .map((s) => {
            const faved = favs.includes(s.id);
            return `
            <article class="card">
                <div class="card-top">
                    <h2>${s.name}</h2>
                    <button class="fav-btn ${faved ? "faved" : ""}" data-fav="${s.id}" aria-label="${faved ? "Remove from" : "Add to"} favorites" aria-pressed="${faved}">★</button>
                </div>
                <span class="badge">${s.category}</span>
                <p class="meta">⏱ ${s.duration} · 👥 ${s.team}</p>
                <p class="desc">${s.description}</p>
                <button class="details-btn" data-details="${s.id}">View details</button>
            </article>`;
        })
        .join("");
}

function openModal(id) {
    const service = allServices.find((s) => s.id === Number(id));
    if (!service) return;
    modalTitle.textContent = service.name;
    modalBody.innerHTML = `
        <span class="badge">${service.category}</span>
        <p class="meta">⏱ ${service.duration} · 👥 ${service.team}</p>
        <p>${service.description}</p>
        <h3>What's included</h3>
        <ul>${service.includes.map((item) => `<li>${item}</li>`).join("")}</ul>`;
    modal.showModal();
}

async function init() {
    allServices = await getServices();
    if (allServices.length === 0) {
        cardsEl.innerHTML = `<p class="no-results">Could not load services. Please refresh the page.</p>`;
        return;
    }
    renderCategories();
    render();
}

categoriesEl.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    activeCategory = chip.dataset.category;
    renderCategories();
    render();
});

cardsEl.addEventListener("click", (e) => {
    const favBtn = e.target.closest("[data-fav]");
    if (favBtn) {
        toggleFavorite(Number(favBtn.dataset.fav));
        render();
        return;
    }
    const detailsBtn = e.target.closest("[data-details]");
    if (detailsBtn) openModal(detailsBtn.dataset.details);
});

document.getElementById("modal-close").addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
});

init();
