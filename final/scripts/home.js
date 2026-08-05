import "./main.js";
import { getServices } from "./services.mjs";

const VISIT_KEY = "avek-last-visit";

function showVisitMessage() {
    const el = document.getElementById("visit-message");
    const last = localStorage.getItem(VISIT_KEY);
    if (last) {
        const days = Math.floor((Date.now() - Number(last)) / 86400000);
        el.textContent =
            days < 1
                ? "Welcome back! You visited us earlier today."
                : `Welcome back! Your last visit was ${days} day${days === 1 ? "" : "s"} ago.`;
    } else {
        el.textContent = "Welcome to Avek Cleaning! We're glad you're here.";
    }
    localStorage.setItem(VISIT_KEY, String(Date.now()));
}

async function renderFeatured() {
    const services = await getServices();
    const container = document.getElementById("featured-cards");
    const featured = services.filter((s) => s.popular);
    container.innerHTML = featured
        .map(
            (s) => `
        <article class="card">
            <h3>${s.name}</h3>
            <span class="badge">${s.category}</span>
            <p class="meta">⏱ ${s.duration} · 👥 ${s.team}</p>
            <p class="desc">${s.description}</p>
        </article>`
        )
        .join("");
}

showVisitMessage();
renderFeatured();
