function validateContactForm() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (name.length < 3) {
        alert("Please enter a valid name (min 3 characters).");
        return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
        alert("Please enter a valid email address.");
        return false;
    }

    if (subject.length < 3) {
        alert("Subject should be at least 3 characters.");
        return false;
    }

    if (message.length < 10) {
        alert("Message should be at least 10 characters.");
        return false;
    }

    alert("Thank you for contacting BagBag! We'll get back to you soon.");
    return true;
}
