// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

// ===== DROPDOWN TOGGLE FOR MEN / WOMEN =====
const subDropdowns = document.querySelectorAll('.sub-dropdown > a');

subDropdowns.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // prevent default anchor action
        const subMenu = link.nextElementSibling;

        // Close other open submenus
        document.querySelectorAll('.sub-menu').forEach(menu => {
            if(menu !== subMenu) menu.style.display = 'none';
        });

        // Toggle current submenu
        if(subMenu.style.display === 'block') {
            subMenu.style.display = 'none';
        } else {
            subMenu.style.display = 'block';
        }
    });
});

// ===== MODAL FUNCTIONALITY (OPTIONAL) =====
function openModal(title, desc, price, img) {
    const modal = document.getElementById('adModal');
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-desc').innerText = desc;
    document.getElementById('modal-price').innerText = 'Pkr-' + price;
    document.getElementById('modal-img').src = img;
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('adModal').style.display = 'none';
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('adModal');
    if(event.target == modal) modal.style.display = 'none';
}

// feedback

let selectedRating = 0;

/* ===== STAR RATING ===== */
function rate(value) {
    selectedRating = value;
    const stars = document.querySelectorAll(".star");

    stars.forEach((star, index) => {
        star.classList.toggle("active", index < value);
    });
}

/* ===== FORM VALIDATION ===== */
function submitFeedback() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const type = document.getElementById("type").value;
    const message = document.getElementById("message").value.trim();

    if (name.length < 3) {
        alert("Please enter a valid name (min 3 characters).");
        return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
        alert("Please enter a valid email address.");
        return false;
    }

    if (type === "Select Feedback Type") {
        alert("Please select feedback type.");
        return false;
    }

    if (selectedRating === 0) {
        alert("Please give a rating.");
        return false;
    }

    if (message.length < 10) {
        alert("Feedback message must be at least 10 characters.");
        return false;
    }

    alert("Thank you for your feedback ❤️");
    return true; // form submit ho jayega
}