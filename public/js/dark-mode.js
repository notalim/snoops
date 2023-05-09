function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function applyTheme() {
    var theme = getCookie("theme") || "light";
    if (theme === "dark") {
        document.body.classList.add("dark");
        document.getElementById("theme-toggle").classList.add("fa-sun");
        document.getElementById("theme-toggle").classList.remove("fa-moon");
    } else {
        document.body.classList.remove("dark");
        document.getElementById("theme-toggle").classList.add("fa-moon");
        document.getElementById("theme-toggle").classList.remove("fa-sun");
    }
}

document.getElementById("theme-toggle").addEventListener("click", function () {
    var isDark = document.body.classList.toggle("dark");
    this.classList.toggle("fa-moon");
    this.classList.toggle("fa-sun");

    var theme = isDark ? "dark" : "light";
    setCookie("theme", theme, 30);
});

// Apply the theme when the page loads
document.addEventListener("DOMContentLoaded", function () {
    applyTheme();
});