const menuButton = document.querySelector("#menu");
const navigation = document.querySelector("#navMenu");

menuButton.addEventListener("click", () => {
    navigation.classList.toggle("open");
});