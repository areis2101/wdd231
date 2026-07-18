// Footer Dates
document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

// Directory Variables
const container = document.getElementById('directory-container');
const gridBtn = document.getElementById('grid-btn');
const listBtn = document.getElementById('list-btn');

// Fetch Members
async function getMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error("Failed to fetch JSON");
        const members = await response.json();
        displayMembers(members);
    } catch (error) {
        console.error("Error fetching member data:", error);
    }
}

// Display Members
function displayMembers(members) {
    container.innerHTML = ""; // Clear existing content
    members.forEach(member => {
        let card = document.createElement('section');
        card.innerHTML = `
            <div class="card-header">
                <h3>${member.name}</h3>
                <p class="tagline">${member.tagline}</p>
            </div>
            <hr>
            <div class="card-body">
                <img src="images/${member.image}" alt="${member.name} logo" loading="lazy">
                <div class="card-info">
                    <p><strong>EMAIL:</strong> ${member.email}</p>
                    <p><strong>PHONE:</strong> ${member.phone}</p>
                    <p><strong>URL:</strong> <a href="http://${member.website}" target="_blank">${member.website}</a></p>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Toggle Views
gridBtn.addEventListener("click", () => {
    container.classList.add("grid");
    container.classList.remove("list");
});

listBtn.addEventListener("click", () => {
    container.classList.add("list");
    container.classList.remove("grid");
});

// Initialize
getMembers();