import { dbConnection, closeConnection } from "../config/mongoConnection.js";

import userDataFunctions from "../data/users.js";
import acenterDataFunctions from "../data/acenters.js";

const db = await dbConnection();
await db.dropDatabase();

// ********** TESTING DATA **********

let adoptionCenterTest = {
    email: "adoptioncenter@test.com",
    password: "password",
    firstName: "Adoption",
    lastName: "Center",
    phone: "1234567890",
    address: "1234 Test Street",
};

// ********** TESTS FOR ADOPTION CENTERS **********

console.log("Testing adoption centers");

let acenter = await acenterDataFunctions.createAdoptionCenter(
    adoptionCenterTest.email,
    adoptionCenterTest.password,
    adoptionCenterTest.firstName,
    adoptionCenterTest.lastName,
    adoptionCenterTest.phone,
    adoptionCenterTest.address
);

console.log("Done testing / seeding database");

await closeConnection();
