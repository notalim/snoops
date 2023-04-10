let tempArr = [
    {
        name: "Louis",
        breeds: ["Chocolate Labrador Retriever"],
        age: 1,
        gender: "M",
        size: 30,
    },
    {
        name: "Max",
        breeds: ["Golden Retriever"],
        age: 4,
        gender: "M",
        size: 35,
    },
    {
        name: "Joe",
        breeds: ["Cool Dog", "Doggy Dog"],
        age: 3,
        gender: "M",
        size: 30,
    },
];

function breedName(breeds) {
    if (breeds.length > 1) {
        return breeds[0] + " Mix";
    } else {
        return breeds[0];
    }
}

let dogName = document.getElementById("dog-name");
let dogBreeds = document.getElementById("dog-breeds");
let dogAge = document.getElementById("dog-age");

dogName.textContent = tempArr[0].name;
dogBreeds.textContent = breedName(tempArr[0].breeds);
dogAge.textContent = tempArr[0].age;

let i = 0;

let leftButton = document.getElementsByClassName("scroller-button")[0];
let rightButton = document.getElementsByClassName("scroller-button")[1];

leftButton.addEventListener("click", () => {
    if (i === 0) {
        i = tempArr.length - 1;
    } else {
        i--;
    }

    dogName.textContent = tempArr[i].name;
    dogBreeds.textContent = breedName(tempArr[i].breeds);
    dogAge.textContent = tempArr[i].age;
});

rightButton.addEventListener("click", () => {
    if (i === tempArr.length) {
        i = 0;
    } else {
        i++;
    }

    dogName.textContent = tempArr[i].name;
    dogBreeds.textContent = breedName(tempArr[i].breeds);
    dogAge.textContent = tempArr[i].age;
});
