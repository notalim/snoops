/*
    This file is used to test the main algorithm.
    This is useful for testing and development purposes.
*/

import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import chalk from "chalk";

import userDataFunctions from "../data/users.js";
import acenterDataFunctions from "../data/acenters.js";

const db = await dbConnection();
await db.dropDatabase();

const test_section = chalk.yellow;
const test_log = chalk.blue;
const test_error = chalk.red;

// ********** TESTING DATA **********

let adoptionCenterTest = {
    email: "adoption@email1.com",
    name: "Adoption Center One",
    password: "Password123_",
    contactFirstName: "Adoption",
    contactLastName: "Center",
    phone: "9295054338",
    address: "1234 Test Street",
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

let dogTest3 = {
    name: "Dog 3",
    dob: "2021-02-04",
    breeds: ["breed5"],
    gender: "F",
    size: 40,
};

let userTest1 = {
    email: "yrajput@test.com",
    password: "Password123@",
    firstName: "Yousaf",
    lastName: "Rajput",
    dob: "2002-01-01",
    phone: "9295054335",
    address: "1 Campus Drive, Stony Brook, NY 11794",
};

let userTest2 = {
    email: "akassymov@test.com",
    password: "Passw!2105",
    firstName: "Alim",
    lastName: "Kassymov",
    dob: "2002-01-04",
    phone: "9295054336",
    address: "Main Street, New York, NY 10001",
};

// ********** SEEDING DATA **********

console.log(test_section("********** SEEDING DATA **********"));

let acenter1;
let dog1, dog2;
let user1, user2;

console.log(test_log("Creating an adoption center"));

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
} catch (e) {
    console.log(test_error(e));
}

console.log(test_log("Creating two dogs"));

try {
    dog1 = await acenterDataFunctions.createDog(
        acenter1._id.toString(),
        dogTest1.name,
        dogTest1.dob,
        dogTest1.breeds,
        dogTest1.gender,
        dogTest1.size
    );
} catch (e) {
    console.log(test_error(e));
}

try {
    dog2 = await acenterDataFunctions.createDog(
        acenter1._id.toString(),
        dogTest2.name,
        dogTest2.dob,
        dogTest2.breeds,
        dogTest2.gender,
        dogTest2.size
    );
} catch (e) {
    console.log(test_error(e));
}

console.log(test_log("Creating 2 users"));

try {
    user1 = await userDataFunctions.createUser(
        userTest1.email,
        userTest1.password,
        userTest1.firstName,
        userTest1.lastName,
        userTest1.dob,
        userTest1.phone,
        userTest1.address
    );
    console.log(test_log("User 1 created"));
} catch (e) {
    console.log(test_error("Error creating user 1"));
    console.log(test_error(e));
}

try {
    user2 = await userDataFunctions.createUser(
        userTest2.email,
        userTest2.password,
        userTest2.firstName,
        userTest2.lastName,
        userTest2.dob,
        userTest2.phone,
        userTest2.address
    );
    console.log(test_log("User 2 created"));
} catch (e) {
    console.log(test_error("Error creating user 2"));
    console.log(test_error(e));
}

// ********** TESTS FOR MAIN ALGO **********

console.log(test_section("********** TESTS FOR MAIN ALGO **********"));

console.log(test_log("User 1 liking Dog 1:"));

try {
    await userDataFunctions.swipeRight(
        user1._id.toString(),
        acenter1._id.toString(),
        dog1._id.toString()
    );
    console.log(test_log("User1 liked Dog1"));
} catch (e) {
    console.log(test_error("Error liking dog"));
    console.log(test_error(e));
}

console.log(test_log("User 1 not liking Dog 2:"));

try {
    await userDataFunctions.swipeLeft(
        user1._id.toString(),
        acenter1._id.toString(),
        dog2._id.toString()
    );
    console.log(test_log("User1 didn't like Dog1"));
} catch (e) {
    console.log(test_error("Error not liking dog"));
    console.log(test_error(e));
}

console.log(test_log("User 1 updated object:"));

try {
    let user1Updated = await userDataFunctions.getUser(user1._id.toString());
    console.log(user1Updated);
} catch (e) {
    console.log(test_error("Error getting user"));
    console.log(test_error(e));
}

console.log(test_log("User 2 liking Dog 1:"));

try {
    await userDataFunctions.swipeRight(
        user2._id.toString(),
        acenter1._id.toString(),
        dog1._id.toString()
    );
    console.log(test_log("User 2 liked Dog 1"));
} catch (e) {
    console.log(test_error("Error liking dog"));
    console.log(test_error(e));
}

console.log(test_log("User 2 liking Dog 2:"));

try {
    await userDataFunctions.swipeRight(
        user2._id.toString(),
        acenter1._id.toString(),
        dog2._id.toString()
    );
    console.log(test_log("User 2 liked Dog 2"));
} catch (e) {
    console.log(test_error("Error liking dog"));
    console.log(test_error(e));
}

console.log(test_log("User 2 updated object:"));

try {
    let user2Updated = await userDataFunctions.getUser(user2._id.toString());
    console.log(user2Updated);
} catch (e) {
    console.log(test_error("Error getting user"));
    console.log(test_error(e));
}

console.log(test_log("Creating dog 3:"));

try {
    let dog3 = await acenterDataFunctions.createDog(
        acenter1._id.toString(),
        "Dog 3",
        "2021-02-04",
        ["breed5"],
        "F",
        40,
    );
    console.log(test_log("Dog 3 created"));
} catch (e) {
    console.log(test_error("Error creating dog 3"));
    console.log(test_error(e));
}

console.log(test_log("User 1 trying to see a dog that haven't seen:"));

try {
    let res = await userDataFunctions.getUnseenDogs(
        user1._id.toString()
    )
    console.log(res);
} catch (e) {
    console.log(test_error("Error getting unseen dog"));
    console.log(test_error(e));
}


console.log(test_section("Done testing / seeding database"));

await closeConnection();
