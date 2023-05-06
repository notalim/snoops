function calculateAge(dob) {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();
    const dayDifference = today.getDate() - dob.getDate();

    if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < dob.getDate())
    ) {
        age--;
    }

    if (age === 0) {
        const monthAge = today.getMonth() - dob.getMonth();
        if (monthDifference === 0 && dayDifference < 30) {
            return "Less than a month old";
        } else {
            return `${monthAge === 1 ? "1 month" : monthAge + " months"} old`;
        }
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

function getBreedsArray() {
    // ! don't forget to validate the inptus
    const breed1 = document.getElementById("dogBreed1").value;
    const breed2 = document.getElementById("dogBreed2").value;
    const breed3 = document.getElementById("dogBreed3").value;

    const breeds = [breed1, breed2, breed3].filter((breed) => breed !== "");
    // console.log(breeds);
    return breeds;
}

function setupAddDogCardEventListener(selector, style) {
    const addDogBtn = document.querySelector(selector);
    if (addDogBtn) {
        addDogBtn.addEventListener("click", function (event) {
            event.preventDefault();
            document.querySelector("#create-dog-modal").style.display = style;
        });
    } else {
        setTimeout(setupAddDogCardEventListener, 100);
    }
}

function setupUpdateDogCardEventListener(selector, style) {
    const updateDogBtn = document.querySelector(selector);
    if (updateDogBtn) {
        updateDogBtn.addEventListener("click", function (event) {
            event.preventDefault();
            document.querySelector("#update-dog-modal").style.display = style;
        });
    } else {
        setTimeout(() => setupUpdateDogCardEventListener(selector, style), 100);
    }
}
function openUpdateDogModal(card) {
    const dogId = card.dataset.dogId;
    const dogModal = document.querySelector("#update-dog-modal");
    dogModal.dataset.dogId = dogId;

    const dogName = card.querySelector("h4").textContent;
    const dogDob = card.dataset.dob;
    const dogBreeds = card.dataset.breeds.split(", ");
    const dogGender = card.dataset.gender;
    const dogSize = card.dataset.size;
    const dogDescription = card.querySelector("p.description").textContent;
    const dogAdoptionStatus =
        card.querySelector("p.adoptionStatus").textContent;

    const deleteButton = dogModal.querySelector(".delete-dog-btn");
    deleteButton.dataset.dogId = dogId;

    dogModal.querySelector("#dogUpdateName").value = dogName;
    dogModal.querySelector("#dogUpdateDob").value = dogDob;

    const dogImgSrc = card.querySelector("img").src;
    const [dogBreed1, dogBreed2, dogBreed3] = dogBreeds;

    dogModal.querySelector("#dogUpdateBreed1").value = dogBreed1 || "";
    dogModal.querySelector("#dogUpdateBreed2").value = dogBreed2 || "";
    dogModal.querySelector("#dogUpdateBreed3").value = dogBreed3 || "";

    dogModal.querySelector("#dogUpdateImagePreview").src = dogImgSrc;
    dogModal.querySelector("#dogUpdateGender").value = dogGender;
    dogModal.querySelector("#dogUpdateSize").value = dogSize;
    dogModal.querySelector("#dogUpdateDescription").value = dogDescription;
    dogModal.querySelector("#dogUpdateAdoptionStatus").value =
        dogAdoptionStatus;

    dogModal.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
    const dogCards = document.querySelectorAll(".dog-card");

    // create dogCard
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

    setupAddDogCardEventListener(".add-dog-btn", "block");
    setupAddDogCardEventListener(".create-dog-close", "none");

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

    function deleteDog(dogId, adoptionCenterId) {
        fetch(`/acenters/ac-dashboard/${adoptionCenterId}/dogs/${dogId}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    console.error("Error deleting dog", response);
                } else {
                    // Reload the page to show the updated list of dogs
                    location.reload();
                }
            })
            .catch((error) => {
                console.error("Error deleting dog:", error);
            });
    }

    document.querySelectorAll(".delete-dog-btn").forEach((btn) => {
        btn.addEventListener("click", (event) => {
            const dogId = event.target.dataset.dogId;
            const adoptionCenterId = window.location.pathname.split("/")[3];
            // console.log(dogId, adoptionCenterId);
            deleteDog(dogId, adoptionCenterId);
        });
    });

    dogCards.forEach((card) => {
        card.addEventListener("click", function (event) {
            event.stopPropagation();
            event.preventDefault();
            console.log("clicked");
            openUpdateDogModal(card);
        });
    });

    const closeModal = document.querySelector(".update-dog-close");

    closeModal.addEventListener("click", () => {
        document.querySelector("#update-dog-modal").style.display = "none";
    });
});
