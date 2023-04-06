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

console.log("Testing adoption centers");

console.log("Creating adoption center");

let acenter = await acenterDataFunctions.createAdoptionCenter(
    adoptionCenterTest.email,
    adoptionCenterTest.name,
    adoptionCenterTest.password,
    adoptionCenterTest.contactFirstName,
    adoptionCenterTest.contactLastName,
    adoptionCenterTest.phone,
    adoptionCenterTest.address
);

let acenter2 = await acenterDataFunctions.createAdoptionCenter(
    adoptionCenterTest2.email,
    adoptionCenterTest2.name,
    adoptionCenterTest2.password,
    adoptionCenterTest2.contactFirstName,
    adoptionCenterTest2.contactLastName,
    adoptionCenterTest2.phone,
    adoptionCenterTest2.address
);

console.log("Getting adoption center");

let testId = acenter._id;
// why doesn't this work?
// let testId = acenter.id;


let acenter3 = await acenterDataFunctions.getAdoptionCenter(testId.toString());

console.log("This should be the same as the first adoption center: ");
console.log(acenter3);

console.log("Getting all adoption centers, this should be 2:");

let acenterList = await acenterDataFunctions.getAllAdoptionCenters();

console.log(acenterList);

console.log("Updating adoption center");

let acenter4 = await acenterDataFunctions.updateAdoptionCenter(
    testId.toString(),
    adoptionCenterTest.email,
    adoptionCenterTest.name,
    adoptionCenterTest.password,
    "New First Name",
    "New Last Name",
    adoptionCenterTest.phone,
    adoptionCenterTest.address
);

console.log("This should be the same as the first adoption center, but changed the contact name: ");

console.log(acenter4);


console.log("Done testing / seeding database");

await closeConnection();
