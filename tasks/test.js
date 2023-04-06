import { dbConnection, closeConnection } from "../config/mongoConnection.js";

import userDataFunctions from "../data/users.js";
import acenterDataFunctions from "../data/acenters.js";

const db = await dbConnection();
await db.dropDatabase();

// ********** TESTING DATA **********

let adoptionCenterTest = {
    email: "adoptioncenter1@test.com",
    name: "Adoption Center 1",
    password: "password",
    contactFirstName: "Adoption",
    contactLastName: "Center",
    phone: "1234567890",
    address: "1234 Test Street",
};

let adoptionCenterTest2 = {
    email: "adoptioncenter2@test.com",
    name: "Adoption Center 2",
    password: "password",
    contactFirstName: "Another",
    contactLastName: "Center",
    phone: "0987654321",
    address: "4321 Test Street",
};

// ********** TESTS FOR ADOPTION CENTERS **********

let acenter, acenter2, acenter3, acenter4, acenter5;
let acenterList, acenterList2;

console.log("Testing adoption centers");

console.log("Creating adoption center");

try {
    acenter = await acenterDataFunctions.createAdoptionCenter(
        adoptionCenterTest.email,
        adoptionCenterTest.name,
        adoptionCenterTest.password,
        adoptionCenterTest.contactFirstName,
        adoptionCenterTest.contactLastName,
        adoptionCenterTest.phone,
        adoptionCenterTest.address
    );
} catch (e) {
    console.log(e);
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
} catch (e) {
    console.log(e);
};

console.log("Getting adoption center");

try {
    let testId = acenter._id;
    acenter3 = await acenterDataFunctions.getAdoptionCenter(testId.toString());
} catch (e) {
    console.log(e);
}

console.log("This should be the same as the first adoption center: ");
console.log(acenter3);

console.log("Getting all adoption centers, this should be 2:");

try {
    let acenterList = await acenterDataFunctions.getAllAdoptionCenters();
    console.log(acenterList.length);
} catch (e) {
    console.log(e);
}

console.log("Updating adoption center");

try {
    let testId = acenter._id;
    acenter4 = await acenterDataFunctions.updateAdoptionCenter(
        testId.toString(),
        adoptionCenterTest.email,
        adoptionCenterTest.name,
        adoptionCenterTest.password,
        "New First Name",
        "New Last Name",
        adoptionCenterTest.phone,
        adoptionCenterTest.address
    );
} catch (e) {
    console.log(e);
}

console.log("This should be the same as the first adoption center, but changed the contact name: ");
console.log(acenter4);

console.log("Deleting adoption center");
try {
    let testId = acenter4._id;
    await acenterDataFunctions.deleteAdoptionCenter(testId.toString());
} catch (e) {
    console.log(e);
}
console.log("This should be not found: ");

try {
    let testId = acenter4._id;
    acenter5 = await acenterDataFunctions.getAdoptionCenter(testId.toString());
    console.log(acenter5);
} catch (e) {
    console.log(e);
}

console.log("This should be 1: ");

try {
    let acenterList2 = await acenterDataFunctions.getAllAdoptionCenters();
    console.log(acenterList2.length);
} catch (e) {
    console.log(e);
}

console.log("Done testing / seeding database");

await closeConnection();
