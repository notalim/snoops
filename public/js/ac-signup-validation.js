import clientValidation from "./client-validation-methods.js";

let signupForm = document.getElementById("signup-form");

if (signupForm) {
    let emailAddressIn = document.getElementById("email");
    let nameIn = document.getElementById("name");
    let passwordIn = document.getElementById("password");
    let firstNameIn = document.getElementById("firstName");
    let lastNameIn = document.getElementById("lastName");
    let phoneIn = document.getElementById("phone");
    let addressIn = document.getElementById("address");

    let error = document.getElementById("error");

    signupForm.addEventListener("submit", function (event) {
        try {
            error.hidden = true;
            event.preventDefault();
            emailAddressIn.value = clientValidation.checkEmailRegex(
                emailAddressIn.value,
                "Email Address"
            );
            nameIn.value = clientValidation.checkString(nameIn.value, "Name");
            passwordIn.value = clientValidation.checkPassword(passwordIn.value, "Password");
            firstNameIn.value = clientValidation.checkName(firstNameIn.value, "First Name");
            lastNameIn.value = clientValidation.checkName(lastNameIn.value, "Last Name");

            phoneIn.value = clientValidation.checkPhoneRegex(phoneIn.value, "Phone Number");
            addressIn.value = clientValidation.checkString(addressIn.value, "Address");

            event.target.submit();
            error.hidden = false;
        } catch (e) {
            event.preventDefault();
            error.hidden = false;
            error.innerHTML = e;
        }
    });
}