/*
This file is for testing the data functions for users.
*/

import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import chalk from "chalk";

import userDataFunctions from "../data/users.js";

const db = await dbConnection();
await db.collection("users").drop();

const test_section = chalk.yellow;
const test_log = chalk.blue;
const test_error = chalk.red;

// ********** TESTING DATA **********

let userTest = {
    email: "useremail@test.com",
    password: "Password123!",
    firstName: "User",
    lastName: "Test",
    dob: "2002-01-01",
    phone: "9295054335",
    address: "1234 Test Street",
};

let userTest2 = {
    email: "useremail@test2.com",
    password: "yesPassword123!",
    firstName: "User2",
    lastName: "Testy",
    dob: "1992-06-03",
    phone: "9295054333",
    address: "Test Street, Manhattan, NY 10001",
};

// ********** TESTS USERS **********

console.log(test_section("********** TESTS FOR USERS **********"));

let user1, user2, user3, user4, user5;

console.log(test_log("Creating 2 users"));

try {
    user1 = await userDataFunctions.createUser(
        userTest.email,
        userTest.password,
        userTest.firstName,
        userTest.lastName,
        userTest.dob,
        userTest.phone,
        userTest.address
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

console.log(test_log("Getting all users"));

try {
    let users = await userDataFunctions.getAllUsers();
    console.log(users);
} catch (e) {
    console.log(test_error("Error getting all users"));
    console.log(test_error(e));
}

console.log(test_log("Getting user 1 by id"));

try {
    let user = await userDataFunctions.getUser(user1._id.toString());
    console.log(user);
} catch (e) {
    console.log(test_error("Error getting user 1 by id"));
    console.log(test_error(e));
}

console.log(test_log("Removing user 1"));

try {
    let user = await userDataFunctions.deleteUser(user1._id.toString());
} catch (e) {
    console.log(test_error("Error removing user 1"));
    console.log(test_error(e));
}

console.log(test_log("Getting all users, this time user 1 should be gone:"));

try {
    let users = await userDataFunctions.getAllUsers();
    console.log(users);
} catch (e) {
    console.log(test_error("Error getting all users"));
    console.log(test_error(e));
}

console.log(test_log("Updating user 2"));

try {
    let user = await userDataFunctions.updateUser(
        user2._id.toString(),
        "faketest@email.com",
        userTest2.password,
        userTest2.firstName,
        userTest2.lastName,
        userTest2.dob,
        userTest2.phone,
        userTest2.address
    );
} catch (e) {
    console.log(test_log("Error updating user 2"));
    console.log(test_log(e));
}

console.log(test_log("Getting user 2 by id, this should be updated:"));

try {
    let user = await userDataFunctions.getUser(user2._id.toString());
    console.log(user);
} catch (e) {
    console.log(test_error("Error getting user 2 by id"));
    console.log(test_error(e));
}

console.log(test_log("Try to create a user 3, and login with user 3"));

try {
    let newUser = await userDataFunctions.createUser(
        "test@login.com",
        "Password123!",
        "User3",
        "Login",
        20,
        "9295054335",
        "1234 Test Street"
    );
    console.log(test_log("User 3 created"));
    user3 = await userDataFunctions.loginUser("test@login.com", "Password123!");
    console.log(test_log("User 3 logged in"));
} catch (e) {
    console.log(test_error("Error creating / logging user 3"));
    console.log(test_error(e));
}

console.log(
    test_log(
        "Try to create a user 4, and login with user 4, this should throw wrong password:"
    )
);

try {
    let newUser = await userDataFunctions.createUser(
        "fail@login.com",
        "Password123!",
        "User4",
        "FailLogin",
        20,
        "9295054335",
        "1234 Test Street"
    );
    console.log(test_log("User 4 created"));
    let user = await userDataFunctions.loginUser(
        "fail@login.com",
        "Password123_"
    );
    console.log(test_error("User 4 logged in"));
} catch (e) {
    console.log(test_log("Error creating / logging user 4"));
    console.log(test_log(e));
}

console.log(test_section("Done testing / seeding database"));

await closeConnection();
