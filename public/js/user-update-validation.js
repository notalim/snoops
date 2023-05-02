import clientValidation from "./client-validation-methods.js";

let updateForm = document.getElementById("update-user");

if (updateForm) {
    let emailAddressIn = document.getElementById("email");
    let passwordIn = document.getElementById("password");
    let firstNameIn = document.getElementById("firstName");
    let lastNameIn = document.getElementById("lastName");
    let dobIn = document.getElementById("dob");
    let phoneIn = document.getElementById("phone");
    let addressIn = document.getElementById("address");

    let error = document.getElementById("error");

    updateForm.addEventListener("submit", function (event) {
        try {
            console.log("fire the form")
            error.hidden = true;
            event.preventDefault();

            firstNameIn.value = clientValidation.checkName(
                firstNameIn.value,
                "First Name"
            );
            lastNameIn.value = clientValidation.checkName(
                lastNameIn.value,
                "Last Name"
            );

            emailAddressIn.value = clientValidation.checkEmailRegex(
                emailAddressIn.value,
                "Email Address"
            );

            dobIn.value = clientValidation.checkDate(
                dobIn.value,
                "Date of Birth"
            );

            phoneIn.value = clientValidation.checkPhoneRegex(
                phoneIn.value,
                "Phone Number"
            );

            if (passwordIn.value) {
                passwordIn.value = clientValidation.checkPassword(
                    passwordIn.value,
                    "Password"
                );
            }

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
