const USED_KEY = "sparkle-reply-usage";

const searchInput = document.getElementById("search");
const categoriesEl = document.getElementById("categories");
const cardsEl = document.getElementById("cards");
const countEl = document.getElementById("result-count");

let allResponses = [];
let activeCategory = "All";

function getUsage() {
    return JSON.parse(localStorage.getItem(USED_KEY) || "{}");
}

function saveUsage(usage) {
    localStorage.setItem(USED_KEY, JSON.stringify(usage));
}

function matches(response, term) {
    if (!term) return true;
    const haystack = [response.title, response.text, response.category, ...response.keywords]
        .join(" ")
        .toLowerCase();
    return term.toLowerCase().split(/\s+/).every((word) => haystack.includes(word));
}

function renderCategories() {
    const categories = ["All", ...new Set(allResponses.map((r) => r.category))];
    categoriesEl.innerHTML = categories
        .map(
            (c) =>
                `<button class="chip ${c === activeCategory ? "selected" : ""}" data-category="${c}">${c}</button>`
        )
        .join("");
}

function render() {
    const term = searchInput.value.trim();
    const usage = getUsage();
    const filtered = allResponses.filter(
        (r) => (activeCategory === "All" || r.category === activeCategory) && matches(r, term)
    );

    countEl.textContent = `${filtered.length} repl${filtered.length === 1 ? "y" : "ies"} found`;

    if (filtered.length === 0) {
        cardsEl.innerHTML = `<p class="no-results">No replies found. Try another keyword like "price", "deep", or "carpet".</p>`;
        return;
    }

    cardsEl.innerHTML = filtered
        .map((r) => {
            const used = usage[r.id] || 0;
            return `
            <article class="card">
                <div class="card-top">
                    <h2>${r.title}</h2>
                    <span class="badge">${r.category}</span>
                </div>
                <p>${r.text}</p>
                <div class="card-bottom">
                    <span class="used">${used > 0 ? `Used ${used}x` : ""}</span>
                    <button class="copy-btn" data-id="${r.id}">Copy</button>
                </div>
            </article>`;
        })
        .join("");
}

async function copyReply(id, btn) {
    const response = allResponses.find((r) => r.id === Number(id));
    if (!response) return;
    try {
        await navigator.clipboard.writeText(response.text);
    } catch {
        const ta = document.createElement("textarea");
        ta.value = response.text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
    }
    const usage = getUsage();
    usage[id] = (usage[id] || 0) + 1;
    saveUsage(usage);
    btn.textContent = "Copied ✓";
    btn.classList.add("copied");
    setTimeout(() => {
        btn.textContent = "Copy";
        btn.classList.remove("copied");
        render();
    }, 1200);
}

async function init() {
    try {
        const res = await fetch("data/responses.json");
        const data = await res.json();
        allResponses = data.responses;
    } catch {
        cardsEl.innerHTML = `<p class="no-results">Could not load replies. Please refresh the page.</p>`;
        return;
    }
    renderCategories();
    render();
}

searchInput.addEventListener("input", render);

categoriesEl.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    activeCategory = chip.dataset.category;
    renderCategories();
    render();
});

cardsEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".copy-btn");
    if (btn) copyReply(btn.dataset.id, btn);
});

const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("main-nav");
menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
});

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;

init();
