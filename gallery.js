// Gallery JS
const items = document.querySelectorAll(".item");

items.forEach((item, i) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(20px)";
    setTimeout(() => {
        item.style.transition = "0.6s ease";
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
    }, i * 100);
});