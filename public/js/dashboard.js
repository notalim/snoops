document.addEventListener("DOMContentLoaded", function () {
    const dogCards = document.querySelectorAll(".dog-card");

    dogCards.forEach((card) => {
        const dob = new Date(card.dataset.dob);
        const size = parseInt(card.dataset.size, 10);
        const gender = card.dataset.gender;

        // Calculate and append gender icon
        const genderIcon = document.createElement("i");
        genderIcon.classList.add("fas");
        genderIcon.classList.add(gender === "M" ? "fa-mars" : "fa-venus");
        card.querySelector("h4").insertAdjacentElement("afterend", genderIcon);

        const age = calculateAge(dob);
        const sizeGroup = getSizeGroup(size);

        // Create and append age and sizeGroup elements to the dog card
        const ageElement = document.createElement("p");
        ageElement.textContent = age;
        card.appendChild(ageElement);

        const sizeGroupElement = document.createElement("p");
        sizeGroupElement.textContent = `${sizeGroup} size`;
        card.appendChild(sizeGroupElement);
    });

    function calculateAge(dob) {
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDifference = today.getMonth() - dob.getMonth();

        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < dob.getDate())
        ) {
            age--;
        }

        if (age === 0) {
            const monthAge = today.getMonth() - dob.getMonth();
            return `${monthAge === 1 ? "1 month" : monthAge + " months"} old`;
        } else {
            return `${age === 1 ? "1 year" : age + " years"} old`;
        }
    }

    function getSizeGroup(size) {
        if (size >= 0 && size <= 24) {
            return "Small";
        } else if (size >= 25 && size <= 59) {
            return "Medium";
        } else if (size >= 60 && size <= 99) {
            return "Large";
        } else if (size >= 100) {
            return "Giant";
        } else {
            return "Unknown";
        }
    }

    function setupAddDogCardEventListener(selector, style) {
        const addDogBtn = document.querySelector(selector);
        if (addDogBtn) {
            addDogBtn.addEventListener("click", function (event) {
                event.preventDefault();
                document.querySelector("#create-dog-modal").style.display =
                    style;
            });
        } else {
            setTimeout(setupAddDogCardEventListener, 100);
        }
    }

    setupAddDogCardEventListener(".add-dog-btn", "block");
    setupAddDogCardEventListener(".create-dog-close", "none");
    function getBreedsArray() {
        // ! don't forget to validate the inptus
        const breed1 = document.getElementById("dogBreed1").value;
        const breed2 = document.getElementById("dogBreed2").value;
        const breed3 = document.getElementById("dogBreed3").value;

        const breeds = [breed1, breed2, breed3].filter((breed) => breed !== "");
        console.log(breeds);
        return breeds;
    }

    let createDogForm = document.getElementById("create-dog-form");
    if (createDogForm) {
        let errorModal = document.getElementById("error");
        createDogForm.addEventListener("submit", (event) => {
            try {
                event.preventDefault();
                const breedsArray = getBreedsArray();
                console.log(breedsArray);
                const breedsJson = JSON.stringify(breedsArray);
                const hiddenBreedsInput = document.createElement("input");
                hiddenBreedsInput.type = "hidden";
                hiddenBreedsInput.name = "breeds";
                hiddenBreedsInput.value = breedsJson;

                createDogForm.appendChild(hiddenBreedsInput);
                document.querySelector("#create-dog-modal").style.display =
                    "none";
                event.target.submit();
                errorModal.hidden = false;
            } catch (e) {
                errorModal.hidden = false;
                errorModal.innerHTML = e;
            }
        });
    }
});
