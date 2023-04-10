/*
    This file is used to seed the database with some initial data.
    This is useful for testing and development purposes.
*/

import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import chalk from "chalk";

import acenterDataFunctions from "../data/acenters.js";
import userDataFunctions from "../data/users.js";

const db = await dbConnection();
await db.dropDatabase();

const test_section = chalk.yellow;
const test_log = chalk.blue;
const test_error = chalk.red;

// ********** SEEDING DATA **********

let adoptionCenter1 = {
    email: "adoption@email1.com",
    name: "Adoption Center One",
    password: "Password123_",
    contactFirstName: "Adoption",
    contactLastName: "Center",
    phone: "9295054338",
    address: "1234 Test Street",
};

let adoptionCenter2 = {
    email: "adoption@email2.com",
    name: "Adoption Center Two",
    password: "Password321!",
    contactFirstName: "Another",
    contactLastName: "Center",
    phone: "9295054339",
    address: "4321 Test Street",
};

let adoptionCenter3 = {
    email: "adoption@email.com",
    name: "Adoption Center Three",
    password: "Password223@",
    contactFirstName: "Last",
    contactLastName: "Center",
    phone: "9295054330",
    address: "43123 Test Avenue",
};

let center1dog1 = {
    name: "Dogger",
    dob: "2020-01-01",
    breeds: ["Lab", "Retriever"],
    gender: "M",
    size: 30,
};

let center1dog2 = {
    name: "Pupper",
    dob: "2021-02-02",
    breeds: ["Poodle", "Terrier"],
    gender: "F",
    size: 40,
};

let center2dog1 = {
    name: "Woofer",
    dob: "2020-01-01",
    breeds: ["Lab", "Retriever"],
    gender: "M",
    size: 30,
};

let center2dog2 = {
    name: "Barker",
    dob: "2021-02-02",
    breeds: ["Bulldog"],
    gender: "F",
    size: 40,
};

let center2dog3 = {
    name: "Doggo",
    dob: "2021-02-02",
    breeds: ["York", "Terrier"],
    gender: "F",
    size: 10,
};

let center3dog1 = {
    name: "Mr. Dog",
    dob: "2020-05-01",
    breeds: ["Doberman", "Pitbull"],
    gender: "M",
    size: 50,
};

let center3dog2 = {
    name: "Miss Dog",
    dob: "2021-07-02",
    breeds: ["Poodle", "Terrier"],
    gender: "F",
    size: 40,
};

let user1 = {
    email: "yrajput@test.com",
    password: "Password123@",
    firstName: "Yousaf",
    lastName: "Rajput",
    dob: "2002-01-01",
    phone: "9295054335",
    address: "1 Campus Drive, Stony Brook, NY 11794",
};

let user2 = {
    email: "akassymov@test.com",
    password: "Passw!2105",
    firstName: "Alim",
    lastName: "Kassymov",
    dob: "2002-02-02",
    phone: "9295054336",
    address: "Main Street, New York, NY 10001",
};

let user3 = {
    email: "ndimeglio@test.com",
    password: "Passw2_425",
    firstName: "Nick",
    lastName: "Dimeglio",
    dob: "2002-03-03",
    phone: "9295054337",
    address: "Mt. Sinai Hospital, New York, NY 10029",
};

let user4 = {
    email: "khalton@test.com",
    password: "P$assw242534",
    firstName: "Kyle",
    lastName: "Halton",
    dob: "2002-04-04",
    phone: "9295054238",
    address: "orlando, FL 32801",
};

// ********** UPLOADING SEEDING DATA **********

console.log(test_section("Seeding database..."));

let center1 = await acenterDataFunctions.createAdoptionCenter(
    adoptionCenter1.email,
    adoptionCenter1.name,
    adoptionCenter1.password,
    adoptionCenter1.contactFirstName,
    adoptionCenter1.contactLastName,
    adoptionCenter1.phone,
    adoptionCenter1.address
);
let center2 = await acenterDataFunctions.createAdoptionCenter(
    adoptionCenter2.email,
    adoptionCenter2.name,
    adoptionCenter2.password,
    adoptionCenter2.contactFirstName,
    adoptionCenter2.contactLastName,
    adoptionCenter2.phone,
    adoptionCenter2.address
);
let center3 = await acenterDataFunctions.createAdoptionCenter(
    adoptionCenter3.email,
    adoptionCenter3.name,
    adoptionCenter3.password,
    adoptionCenter3.contactFirstName,
    adoptionCenter3.contactLastName,
    adoptionCenter3.phone,
    adoptionCenter3.address
);

await acenterDataFunctions.createDog(
    center1._id.toString(),
    center1dog1.name,
    center1dog1.dob,
    center1dog1.breeds,
    center1dog1.gender,
    center1dog1.size
);
await acenterDataFunctions.createDog(
    center1._id.toString(),
    center1dog2.name,
    center1dog2.dob,
    center1dog2.breeds,
    center1dog2.gender,
    center1dog2.size
);
await acenterDataFunctions.createDog(
    center2._id.toString(),
    center2dog1.name,
    center2dog1.dob,
    center2dog1.breeds,
    center2dog1.gender,
    center2dog1.size
);
await acenterDataFunctions.createDog(
    center2._id.toString(),
    center2dog2.name,
    center2dog2.dob,
    center2dog2.breeds,
    center2dog2.gender,
    center2dog2.size
);
await acenterDataFunctions.createDog(
    center2._id.toString(),
    center2dog3.name,
    center2dog3.dob,
    center2dog3.breeds,
    center2dog3.gender,
    center2dog3.size
);
await acenterDataFunctions.createDog(
    center3._id.toString(),
    center3dog1.name,
    center3dog1.dob,
    center3dog1.breeds,
    center3dog1.gender,
    center3dog1.size
);
await acenterDataFunctions.createDog(
    center3._id.toString(),
    center3dog2.name,
    center3dog2.dob,
    center3dog2.breeds,
    center3dog2.gender,
    center3dog2.size
);

let testUser1 = await userDataFunctions.createUser(
    user1.email,
    user1.password,
    user1.firstName,
    user1.lastName,
    user1.dob,
    user1.phone,
    user1.address
);

let testUser2 = await userDataFunctions.createUser(
    user2.email,
    user2.password,
    user2.firstName,
    user2.lastName,
    user2.dob,
    user2.phone,
    user2.address
);

let testUser3 = await userDataFunctions.createUser(
    user3.email,
    user3.password,
    user3.firstName,
    user3.lastName,
    user3.dob,
    user3.phone,
    user3.address
);

let testUser4 = await userDataFunctions.createUser(
    user4.email,
    user4.password,
    user4.firstName,
    user4.lastName,
    user4.dob,
    user4.phone,
    user4.address
);

console.log(test_section("Done seeding database"));

await closeConnection();
