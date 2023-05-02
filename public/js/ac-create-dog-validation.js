import clientValidation from "./client-validation-methods.js";

let createDogForm = document.getElementById("create-dog-form");
let acenterId = createDogForm.dataset.id;

async function submitForm() {
    $.ajax({
        url: `/acenters/ac-dashboard/${acenterId}`,
        type: "POST",
        data: $("#create-dog-form").serialize(),
        success: function (data) {
            console.log(data);
        },
        error: function (err) {
            console.log(err);
        },
    });
}

if (createDogForm) {
    let nameIn = document.getElementById("dogName");
    let dobIn = document.getElementById("dogDob");
    let dogBreed1In = document.getElementById("dogBreed1");
    let dogBreed2In = document.getElementById("dogBreed2");
    let dogBreed3In = document.getElementById("dogBreed3");
    let genderIn = document.getElementById("dogGender");
    let sizeIn = document.getElementById("dogSize");

    let error = document.getElementById("errorModal");

    createDogForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        let error = document.getElementById("errorModal");
        error.hidden = true;
        try {
            console.log("in create dog validation");

            nameIn.value = clientValidation.checkString(nameIn.value, "Name");

            dobIn.value = clientValidation.checkDate(
                dobIn.value,
                "Date of Birth",
                0,
                20
            );

            dogBreed1In.value = clientValidation.checkString(
                dogBreed1In.value,
                "Breed 1"
            );

            if (dogBreed2In) {
                dogBreed2In.value = clientValidation.checkString(
                    dogBreed2In.value,
                    "Breed 2"
                );
            }

            if (dogBreed3In) {
                dogBreed3In.value = clientValidation.checkString(
                    dogBreed3In.value,
                    "Breed 3"
                );
            }

            error.hidden = false;
        } catch (e) {
            event.preventDefault();
            isValid = false;
            error.hidden = false;
            error.innerHTML = e;
        }
        if (isValid) {
            await submitForm();
        }
    });
}
