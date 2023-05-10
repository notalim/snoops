import clientValidation from "./client-validation-methods.js";

let loginForm = document.getElementById("login-form");

if (loginForm) {
    let emailAddressIn = document.getElementById("email");
    let passwordIn = document.getElementById("password");
    let error = document.getElementById("error");

    loginForm.addEventListener("submit", function (event) {
        try {
            error.hidden = true;
            event.preventDefault();
            emailAddressIn.value = clientValidation.checkEmailRegex(
                emailAddressIn.value,
                "Email Address"
            );
            passwordIn.value = clientValidation.checkString(passwordIn.value, "Password");
            event.target.submit();
            error.hidden = false;
        } catch (e) {
            // console.log("kys");
            event.preventDefault();
            error.hidden = false;
            error.innerHTML = e;
        }
    });
}
