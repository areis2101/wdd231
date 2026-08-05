export async function getServices() {
    try {
        const response = await fetch("data/services.json");
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        return data.services;
    } catch (error) {
        console.error("Failed to load services:", error);
        return [];
    }
}

const FAV_KEY = "avek-favorites";

export function getFavorites() {
    return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
}

export function toggleFavorite(id) {
    const favs = getFavorites();
    const index = favs.indexOf(id);
    if (index === -1) {
        favs.push(id);
    } else {
        favs.splice(index, 1);
    }
    localStorage.setItem(FAV_KEY, JSON.stringify(favs));
    return favs;
}
