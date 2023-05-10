/*
    This file is used to seed the database with some initial data.
    This is useful for testing and development purposes.
*/

import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import chalk from "chalk";

import acenterDataFunctions from "../data/acenters.js";
import userDataFunctions from "../data/users.js";
import chatDataFunctions from "../data/chats.js"

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
    address: "324 Monroe St. Hoboken, NJ"
};

let adoptionCenter2 = {
    email: "adoption@email2.com",
    name: "Adoption Center Two",
    password: "Password321!",
    contactFirstName: "Another",
    contactLastName: "Center",
    phone: "9295054339",
    address: "New York City 10001"
};

let adoptionCenter3 = {
    email: "adoption@email.com",
    name: "Adoption Center Three",
    password: "Password223@",
    contactFirstName: "Last",
    contactLastName: "Center",
    phone: "9295054330",
    address: "101 Madison St."
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
    name: "Doggernaut",
    dob: "2020-05-05",
    breeds: ["Doberman", "Pitbull"],
    gender: "M",
    size: 50,
};

let center3dog2 = {
    name: "Doglette",
    dob: "2021-07-02",
    breeds: ["Poodle", "Terrier"],
    gender: "F",
    size: 40,
};

let center1dog3 = {
    name: "Buddy",
    dob: "2019-10-12",
    breeds: ["Golden Retriever"],
    gender: "M",
    size: 60,
};

let center1dog4 = {
    name: "Sadie",
    dob: "2019-06-07",
    breeds: ["Beagle"],
    gender: "F",
    size: 25,
};

let center2dog4 = {
    name: "Rocky",
    dob: "2018-04-05",
    breeds: ["Boxer"],
    gender: "M",
    size: 65,
};

let center2dog5 = {
    name: "Bella",
    dob: "2020-11-11",
    breeds: ["Shih Tzu"],
    gender: "F",
    size: 15,
};

let center3dog3 = {
    name: "Zeus",
    dob: "2019-03-10",
    breeds: ["Great Dane"],
    gender: "M",
    size: 100,
};

let center3dog4 = {
    name: "Lola",
    dob: "2021-01-12",
    breeds: ["Dachshund"],
    gender: "F",
    size: 20,
};

let center3dog5 = {
    name: "Max",
    dob: "2020-09-05",
    breeds: ["German Shepherd"],
    gender: "M",
    size: 75,
};

let center3dog6 = {
    name: "Molly",
    dob: "2019-12-11",
    breeds: ["Border Collie"],
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

let adoptionCenter4 = {
    email: "adoption@email4.com",
    name: "Adoption Center Four",
    password: "Password424$",
    contactFirstName: "Fourth",
    contactLastName: "Center",
    phone: "9295054341",
    address: "200 Main St. Brooklyn, NY",
};

let adoptionCenter5 = {
    email: "adoption@email5.com",
    name: "Adoption Center Five",
    password: "Password525%",
    contactFirstName: "Fifth",
    contactLastName: "Center",
    phone: "9295054342",
    address: "123 Broadway St. Queens, NY",
};

let center4dog1 = {
    name: "Rex",
    dob: "2018-07-10",
    breeds: ["Rottweiler"],
    gender: "M",
    size: 70,
};

let center4dog2 = {
    name: "Luna",
    dob: "2017-02-14",
    breeds: ["Siberian Husky"],
    gender: "F",
    size: 50,
};

let center4dog3 = {
    name: "Charlie",
    dob: "2021-08-08",
    breeds: ["Cocker Spaniel"],
    gender: "M",
    size: 30,
};

let center4dog4 = {
    name: "Sophie",
    dob: "2020-10-01",
    breeds: ["Cavalier King Charles Spaniel"],
    gender: "F",
    size: 25,
};

let center4dog5 = {
    name: "Duke",
    dob: "2018-12-25",
    breeds: ["Bullmastiff"],
    gender: "M",
    size: 90,
};

let center5dog1 = {
    name: "Milo",
    dob: "2019-01-20",
    breeds: ["Australian Shepherd"],
    gender: "M",
    size: 55,
};

let center5dog2 = {
    name: "Stella",
    dob: "2020-03-15",
    breeds: ["Labradoodle"],
    gender: "F",
    size: 45,
};

let center5dog3 = {
    name: "Finn",
    dob: "2021-02-28",
    breeds: ["Whippet"],
    gender: "M",
    size: 35,
};

let center5dog4 = {
    name: "Lily",
    dob: "2018-04-30",
    breeds: ["Bichon Frise"],
    gender: "F",
    size: 15,
};

let center5dog5 = {
    name: "Toby",
    dob: "2019-11-18",
    breeds: ["English Springer Spaniel"],
    gender: "M",
    size: 45,
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
let center4 = await acenterDataFunctions.createAdoptionCenter(
    adoptionCenter4.email,
    adoptionCenter4.name,
    adoptionCenter4.password,
    adoptionCenter4.contactFirstName,
    adoptionCenter4.contactLastName,
    adoptionCenter4.phone,
    adoptionCenter4.address
);

let center5 = await acenterDataFunctions.createAdoptionCenter(
    adoptionCenter5.email,
    adoptionCenter5.name,
    adoptionCenter5.password,
    adoptionCenter5.contactFirstName,
    adoptionCenter5.contactLastName,
    adoptionCenter5.phone,
    adoptionCenter5.address
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
    center1._id.toString(),
    center1dog3.name,
    center1dog3.dob,
    center1dog3.breeds,
    center1dog3.gender,
    center1dog3.size
);

await acenterDataFunctions.createDog(
    center1._id.toString(),
    center1dog4.name,
    center1dog4.dob,
    center1dog4.breeds,
    center1dog4.gender,
    center1dog4.size
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
    center2._id.toString(),
    center2dog4.name,
    center2dog4.dob,
    center2dog4.breeds,
    center2dog4.gender,
    center2dog4.size
);

await acenterDataFunctions.createDog(
    center2._id.toString(),
    center2dog5.name,
    center2dog5.dob,
    center2dog5.breeds,
    center2dog5.gender,
    center2dog5.size
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

await acenterDataFunctions.createDog(
    center3._id.toString(),
    center3dog3.name,
    center3dog3.dob,
    center3dog3.breeds,
    center3dog3.gender,
    center3dog3.size
);

await acenterDataFunctions.createDog(
    center3._id.toString(),

    center3dog4.name,
    center3dog4.dob,
    center3dog4.breeds,
    center3dog4.gender,
    center3dog4.size
);

await acenterDataFunctions.createDog(
    center3._id.toString(),

    center3dog5.name,
    center3dog5.dob,
    center3dog5.breeds,
    center3dog5.gender,
    center3dog5.size
);

await acenterDataFunctions.createDog(
    center3._id.toString(),
    center3dog6.name,
    center3dog6.dob,
    center3dog6.breeds,
    center3dog6.gender,
    center3dog6.size
);

await acenterDataFunctions.createDog(
    center4._id.toString(),
    center4dog1.name,
    center4dog1.dob,
    center4dog1.breeds,
    center4dog1.gender,
    center4dog1.size
);

await acenterDataFunctions.createDog(
    center4._id.toString(),
    center4dog2.name,
    center4dog2.dob,
    center4dog2.breeds,
    center4dog2.gender,
    center4dog2.size
);
await acenterDataFunctions.createDog(
    center4._id.toString(),
    center4dog3.name,
    center4dog3.dob,
    center4dog3.breeds,
    center4dog3.gender,
    center4dog3.size
);
await acenterDataFunctions.createDog(
    center4._id.toString(),
    center4dog4.name,
    center4dog4.dob,
    center4dog4.breeds,
    center4dog4.gender,
    center4dog4.size
);
await acenterDataFunctions.createDog(
    center4._id.toString(),
    center4dog5.name,
    center4dog5.dob,
    center4dog5.breeds,
    center4dog5.gender,
    center4dog5.size
);
await acenterDataFunctions.createDog(
    center5._id.toString(),
    center5dog1.name,
    center5dog1.dob,
    center5dog1.breeds,
    center5dog1.gender,
    center5dog1.size
);
await acenterDataFunctions.createDog(
    center5._id.toString(),
    center5dog2.name,
    center5dog2.dob,
    center5dog2.breeds,
    center5dog2.gender,
    center5dog2.size
);
await acenterDataFunctions.createDog(
    center5._id.toString(),
    center5dog3.name,
    center5dog3.dob,
    center5dog3.breeds,
    center5dog3.gender,
    center5dog3.size
);
await acenterDataFunctions.createDog(
    center5._id.toString(),
    center5dog4.name,
    center5dog4.dob,
    center5dog4.breeds,
    center5dog4.gender,
    center5dog4.size
);
await acenterDataFunctions.createDog(
    center5._id.toString(),
    center5dog5.name,
    center5dog5.dob,
    center5dog5.breeds,
    center5dog5.gender,
    center5dog5.size
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

// let U1C1Chat = await chatDataFunctions.createChat(
//     testUser1._id.toString(),
//     center1._id.toString()
// );

// let U2C1Chat = await chatDataFunctions.createChat(
//     testUser2._id.toString(),
//     center1._id.toString()
// );

// let U1C2Chat = await chatDataFunctions.createChat(
//     testUser1._id.toString(),
//     center2._id.toString()
// );

// let U1C3Chat = await chatDataFunctions.createChat(
//     testUser1._id.toString(),
//     center3._id.toString()
// );

console.log(test_section("Done seeding database"));

await closeConnection();
