document.getElementById("theme-toggle").addEventListener("click", function () {
    var isDark = document.body.classList.toggle("dark");
    this.classList.toggle("fa-moon");
    this.classList.toggle("fa-sun");
});
