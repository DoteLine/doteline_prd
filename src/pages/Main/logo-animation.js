const logo = document.getElementById("logo");

if (logo) {
    setTimeout(() => {
        logo.style.transform = "scale(1.05)";
        logo.style.transition = "transform 1.5s ease-out, text-shadow 1.5s ease-out";
        logo.style.textShadow = "0 0 10px #fff, 0 0 20px #3aa0ff, 0 0 50px #007bff";
    }, 2000);
}
