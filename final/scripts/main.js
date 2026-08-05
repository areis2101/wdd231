export function initLayout() {
    const menuBtn = document.getElementById("menu-btn");
    const nav = document.getElementById("main-nav");
    menuBtn.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", String(open));
    });

    document.getElementById("year").textContent = new Date().getFullYear();
    document.getElementById("lastModified").textContent = document.lastModified;
}

initLayout();
