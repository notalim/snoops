/*
This file is for testing the data functions for adoption centers.
*/

import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import chalk from "chalk";

import acenterDataFunctions from "../data/acenters.js";

const db = await dbConnection();
await db.collection("adoption_centers").drop();

const test_section = chalk.yellow;
const test_log = chalk.blue;
const test_error = chalk.red;

// ********** TESTING DATA **********

let adoptionCenterTest = {
    email: "adoptioncenter1@test.com",
    name: "Adoption Center One",
    password: "Password123_!",
    contactFirstName: "Adoption",
    contactLastName: "Center",
    phone: "9295054338",
    address: "1234 Test Street",
};

let adoptionCenterTest2 = {
    email: "adoptioncenter2@test.com",
    name: "Adoption Center Two",
    password: "Password123_!",
    contactFirstName: "Another",
    contactLastName: "Center",
    phone: "9295054339",
    address: "4321 Test Street",
};

let dogTest1 = {
    name: "Dog 1",
    dob: "2020-01-01",
    breeds: ["breed1", "breed2"],
    gender: "M",
    size: 30,
};

let dogTest2 = {
    name: "Dog 2",
    dob: "2021-02-02",
    breeds: ["breed3", "breed4"],
    gender: "F",
    size: 40,
};

// ********** TESTS FOR ADOPTION CENTERS **********

console.log(test_section("********** TESTS FOR ADOPTION CENTERS **********"));

let acenter1, acenter2, acenter3, acenter4, acenter5;
let acenterList, acenterList2;

console.log(test_log("Creating 2 adoption centers"));

try {
    acenter1 = await acenterDataFunctions.createAdoptionCenter(
        adoptionCenterTest.email,
        adoptionCenterTest.name,
        adoptionCenterTest.password,
        adoptionCenterTest.contactFirstName,
        adoptionCenterTest.contactLastName,
        adoptionCenterTest.phone,
        adoptionCenterTest.address
    );
    console.log(test_log("Adoption Center 1 created"));
} catch (e) {
    console.log(test_error("Error creating Adoption center 1"));
    console.log(test_error(e));
}

try {
    acenter2 = await acenterDataFunctions.createAdoptionCenter(
        adoptionCenterTest2.email,
        adoptionCenterTest2.name,
        adoptionCenterTest2.password,
        adoptionCenterTest2.contactFirstName,
        adoptionCenterTest2.contactLastName,
        adoptionCenterTest2.phone,
        adoptionCenterTest2.address
    );
    console.log(test_log("Adoption Center 2 created"));
} catch (e) {
    console.log(test_error("Error creating Adoption center 2"));
    console.log(test_error(e));
}

console.log(test_log("Getting adoption center"));

try {
    let testId = acenter1._id;
    acenter3 = await acenterDataFunctions.getAdoptionCenter(testId.toString());
    console.log(test_log("Adoption Center 1 retrieved"));
} catch (e) {
    console.log(test_error("Error retrieving Adoption center 1"));
    console.log(test_error(e));
}

console.log(test_log("This should be the same as the first adoption center: "));
console.log(acenter3);

console.log(test_log("Getting all adoption centers, this should be 2:"));

try {
    let acenterList = await acenterDataFunctions.getAllAdoptionCenters();
    console.log(acenterList.length);
} catch (e) {
    console.log(test_error("Error retrieving Adoption centers"));
    console.log(test_error(e));
}

console.log(test_log("Updating adoption center"));

try {
    let testId = acenter1._id;
    acenter4 = await acenterDataFunctions.updateAdoptionCenter(
        testId.toString(),
        adoptionCenterTest.email,
        adoptionCenterTest.name,
        adoptionCenterTest.password,
        "NewFirstName",
        "NewLastName",
        adoptionCenterTest.phone,
        adoptionCenterTest.address
    );
} catch (e) {
    console.log(test_error("Error updating Adoption center"));
    console.log(test_error(e));
}

console.log(
    test_log(
        "This should be the same as the first adoption center, but changed the contact name: "
    )
);
console.log(acenter4);

console.log(test_log("Deleting adoption center"));
try {
    let testId = acenter4._id;
    await acenterDataFunctions.deleteAdoptionCenter(testId.toString());
    console.log(test_log("Adoption Center 1 deleted"));
} catch (e) {
    console.log(test_error("Error deleting Adoption center"));
    console.log(test_error(e));
}

console.log(test_log("Creating it again for further testing:"));

try {
    acenter1 = await acenterDataFunctions.createAdoptionCenter(
        adoptionCenterTest.email,
        adoptionCenterTest.name,
        adoptionCenterTest.password,
        adoptionCenterTest.contactFirstName,
        adoptionCenterTest.contactLastName,
        adoptionCenterTest.phone,
        adoptionCenterTest.address
    );
    console.log(test_log("Adoption Center 1 created"));
} catch (e) {
    console.log(test_error("Error creating Adoption center 1"));
    console.log(test_error(e));
}

console.log(test_log("This should be not found: "));
try {
    let testId = acenter4._id;
    acenter5 = await acenterDataFunctions.getAdoptionCenter(testId.toString());
    console.log(acenter5);
    console.log(test_error("Adoption Center 1 retrieved"));
} catch (e) {
    console.log(test_log("Error retrieving Adoption center"));
    console.log(test_log(e));
}

console.log(test_log("This should be 1: "));
try {
    let acenterList2 = await acenterDataFunctions.getAllAdoptionCenters();
    console.log(acenterList2.length);
} catch (e) {
    console.log(test_error("Error retrieving Adoption centers length"));
    console.log(test_error(e));
}

// ********** TESTS FOR DOGS IN ADOPTION CENTERS **********

console.log(
    test_section("********** TESTS FOR DOGS IN ADOPTION CENTERS **********")
);

console.log(test_log("Creating 2 dogs in adoption center"));
try {
    let testId = acenter2._id;
    // console.log(testId.toString());
    await acenterDataFunctions.createDog(
        testId.toString(),
        dogTest1.name,
        dogTest1.dob,
        dogTest1.breeds,
        dogTest1.gender,
        dogTest1.size
    );
    console.log(test_log("Dog 1 created"));
} catch (e) {
    console.log(test_error("Error creating Dog 1"));
    console.log(test_error(e));
}

try {
    let testId = acenter2._id;
    await acenterDataFunctions.createDog(
        testId.toString(),
        dogTest2.name,
        dogTest2.dob,
        dogTest2.breeds,
        dogTest2.gender,
        dogTest2.size
    );
    console.log(test_log("Dog 2 created"));
} catch (e) {
    console.log(test_error("Error creating Dog 2"));
    console.log(test_error(e));
}

console.log(test_log("Logging the adoption center with the dogs:"));
try {
    console.log(
        await acenterDataFunctions.getAdoptionCenter(acenter2._id.toString())
    );
} catch (e) {
    console.log(test_error("Error retrieving Adoption center"));
    console.log(test_error(e));
}

console.log(test_log("This should give an empty array:"));

try {
    let acenter1Dogs = await acenterDataFunctions.getAllDogs(
        acenter1._id.toString()
    );
    console.log(acenter1Dogs);
} catch (e) {
    console.log(test_error("Error retrieving Adoption center dogs"));
    console.log(test_error(e));
}

console.log(test_log("This should give an array with 2 dogs:"));

try {
    console.log(await acenterDataFunctions.getAllDogs(acenter2._id.toString()));
} catch (e) {
    console.log(test_error(e));
}

console.log(
    test_log(
        "Getting a dog by ID in the adoption center, this should be the first dog:"
    )
);
try {
    let acenterTestId = acenter2._id.toString();
    acenter2 = await acenterDataFunctions.getAdoptionCenter(acenterTestId);
    let dogId = acenter2.dogList[0]._id.toString();

    console.log(
        await acenterDataFunctions.getDogFromAcenter(acenterTestId, dogId)
    );
} catch (e) {
    console.log(test_error("Error retrieving Adoption center dog by ID"));
    console.log(test_error(e));
}

console.log(
    test_log(
        "Updating a dog in the adoption center, this should produce same results:"
    )
);

let acenterTestId = acenter1._id.toString();
let dogTest3 = await acenterDataFunctions.createDog(
    acenterTestId,
    dogTest1.name,
    dogTest1.dob,
    dogTest1.breeds,
    dogTest1.gender,
    dogTest1.size
);

let dogId = dogTest3._id.toString();

try {
    let updatedDog = await acenterDataFunctions.updateDog(
        acenterTestId,
        dogId,
        "NewName",
        dogTest1.dob,
        dogTest1.breeds,
        dogTest1.gender,
        dogTest1.size
    );

    console.log(updatedDog);
    console.log("This should be the same as above:");
    console.log(
        await acenterDataFunctions.getDogFromAcenter(acenterTestId, dogId)
    );

} catch (e) {
    console.log(test_error("Error updating Adoption center dog by ID"));
    console.log(test_error(e));
}

console.log(test_log("Deleting a dog in the adoption center:"));

try {
    await acenterDataFunctions.deleteDog(acenterTestId, dogId);
    console.log("Dog deleted");
} catch (e) {
    console.log(test_error("Error deleting Adoption center dog by ID"));
    console.log(test_error(e));
}

console.log(test_log("This should give an empty array:"));

try {
    let acenter1Dogs = await acenterDataFunctions.getAllDogs(
        acenter1._id.toString()
    );
    console.log(acenter1Dogs);
} catch (e) {
    console.log(test_error("Error retrieving Adoption center dogs"));
    console.log(test_error(e));
}

console.log(test_log("Trying to create an adoption center and login:"));

try {
    let newAcenter = await acenterDataFunctions.createAdoptionCenter(
        "fail@login.com",
        "Adoption Login",
        "Password123!",
        "Acenter4",
        "FailLogin",
        "9295054335",
        "1234 Test Street"
    );
    let acenter1Login = await acenterDataFunctions.logInAdoptionCenter(
        "fail@login.com",
        "Password123!"
    );
    console.log("Successfully logged in");
} catch (e) {
    console.log(test_error("Error logging in Adoption center"));
    console.log(test_error(e));
}

console.log(test_section("Done testing / seeding database"));

await closeConnection();
