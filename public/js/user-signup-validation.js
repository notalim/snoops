import clientValidation from "./client-validation-methods.js";

let signupForm = document.getElementById("signup-form");

if (signupForm) {
    let emailAddressIn = document.getElementById("email");
    let passwordIn = document.getElementById("password");
    let firstNameIn = document.getElementById("firstName");
    let lastNameIn = document.getElementById("lastName");
    let dobIn = document.getElementById("dob");
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
            passwordIn.value = clientValidation.checkPassword(
                passwordIn.value,
                "Password"
            );
            firstNameIn.value = clientValidation.checkName(
                firstNameIn.value,
                "First Name"
            );
            lastNameIn.value = clientValidation.checkName(
                lastNameIn.value,
                "Last Name"
            );

            dobIn.value = clientValidation.checkDate(
                dobIn.value,
                "Date of Birth",
                18,
                120
            );
            
            phoneIn.value = clientValidation.checkPhoneRegex(
                phoneIn.value,
                "Phone Number"
            );
            addressIn.value = clientValidation.checkString(
                addressIn.value,
                "Address"
            );

            event.target.submit();
            error.hidden = false;
        } catch (e) {
            event.preventDefault();
            error.hidden = false;
            error.innerHTML = e;
        }
    });
}
