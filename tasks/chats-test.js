import { dbConnection, closeConnection } from "../config/mongoConnection.js";

import chatDataFunctions from "../data/chats.js";
import acenterDataFunctions from "../data/acenters.js";
import userDataFunctions from "../data/users.js";
import chalk from "chalk";

const db = await dbConnection();
await db.dropDatabase();


const test_section = chalk.yellow;
const test_log = chalk.magentaBright
const test_error = chalk.redBright

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
    dob: "2002-01-01",
    phone: "9295054336",
    address: "Main Street, New York, NY 10001",
};

let user3 = {
    email: "ndimeglio@test.com",
    password: "Passw2_425",
    firstName: "Nick",
    lastName: "Dimeglio",
    dob: "2002-01-01",
    phone: "9295054337",
    address: "Mt. Sinai Hospital, New York, NY 10029",
};

let user4 = {
    email: "khalton@test.com",
    password: "P$assw242534",
    firstName: "Kyle",
    lastName: "Halton",
    dob: "2002-01-01",
    phone: "9295054238",
    address: "orlando, FL 32801",
};

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

let User1 = await userDataFunctions.createUser(
    user1.email,
    user1.password,
    user1.firstName,
    user1.lastName,
    user1.dob,
    user1.phone,
    user1.address
);

let User2 = await userDataFunctions.createUser(
    user2.email,
    user2.password,
    user2.firstName,
    user2.lastName,
    user2.dob,
    user2.phone,
    user2.address
);

let User3 = await userDataFunctions.createUser(
    user3.email,
    user3.password,
    user3.firstName,
    user3.lastName,
    user3.dob,
    user3.phone,
    user3.address
);

let User4 = await userDataFunctions.createUser(
    user4.email,
    user4.password,
    user4.firstName,
    user4.lastName,
    user4.dob,
    user4.phone,
    user4.address
);


//############ TESTING CHATS ##############

console.log(test_section("############### TESTING CREATECHAT #################"));
console.log();
try{
    await chatDataFunctions.createChat(User1._id.toString(), center1._id.toString());
    console.log(test_log(`Created chat between ${User1._id.toString()} and ${center1._id.toString()}`));
}catch(e){
    console.log(test_error(`Error while creating chat between ${User1._id.toString()} and ${center1._id.toString()}`));
    console.log(test_error(e));
}

try{
    await chatDataFunctions.createChat(User1._id.toString(), center1._id.toString());
    console.log(test_log(`Created chat between ${User1._id.toString()} and ${center1._id.toString()}`));
}catch(e){
    console.log(test_error(`Error while creating chat between ${User1._id.toString()} and ${center1._id.toString()}`));
    console.log(test_error(`ERROR: ${e}`));
}

try{
    await chatDataFunctions.createChat(User1._id.toString(), center2._id.toString());
    console.log(test_log(`Created chat between ${User1._id.toString()} and ${center2._id.toString()}`));
}catch(e){
    console.log(test_error(`Error while creating chat between ${User1._id.toString()} and ${center1._id.toString()}`));
    console.log(test_error(`ERROR: ${e}`));
}

try{
    await chatDataFunctions.createChat(User1._id.toString(), center3._id.toString());
    console.log(test_log(`Created chat between ${User1._id.toString()} and ${center3._id.toString()}`));
}catch(e){
    console.log(test_error(`Error while creating chat between ${User1._id.toString()} and ${center1._id.toString()}`));
    console.log(test_error(`ERROR: ${e}`));
}

console.log(test_section("############### TESTING GETALLCHATS FUNCS #################"));
console.log();

try{
    console.log(test_log(`Getting all chats for User1`));
    console.log(await chatDataFunctions.getAllChatsUser(User1._id.toString()));
}catch(e){
    console.log(test_error(e));
}

//Should display only one chat for center1
try{
    console.log(test_log(`Getting all chats for center1`));
    console.log(await chatDataFunctions.getAllChatsACenter(center1._id.toString()));
    await chatDataFunctions.createChat(User2._id.toString(), center1._id.toString());
    console.log(test_log(`Getting all chats for center1 after update`));
    console.log(await chatDataFunctions.getAllChatsACenter(center1._id.toString()));
}catch(e){
    console.log(test_error(e));
}

//Show throw an error
try{
    console.log(await chatDataFunctions.getAllChatsUser(User4._id.toString()));
}catch(e){
    console.log(test_error(e));
}

console.log(test_section("############### TESTING GETCHAT #################"));
console.log();

//This shouldnt throw
try{
    console.log(test_log(`Getting chat between ${User1._id.toString()} and ${center1._id.toString()}`))
    console.log(await chatDataFunctions.getChat(User1._id.toString(), center1._id.toString()));
}catch(e){
    console.log(test_error(e));
}

//This should throw as there isnt a chat between these two users
try{
    console.log(test_log(`Getting chat between ${User2._id.toString()} and ${center3._id.toString()}`))
    console.log(await chatDataFunctions.getChat(User2._id.toString(), center3._id.toString()));
}catch(e){
    console.log(test_error(e))
}

console.log(test_section("############### TESTING POSTMESSAGE #################"));
console.log();

try{
    let message = "Hello my name is jeff";
    await chatDataFunctions.postMessage(
        User1._id.toString(), 
        center1._id.toString(),
        User1._id.toString(),
        message,
        new Date().toLocaleDateString());
}catch(e){
    console.log(test_error(e));
}

try{
    let message = "Hello my name is Mary";
    await chatDataFunctions.postMessage(
        User1._id.toString(), 
        center1._id.toString(),
        center1._id.toString(),
        message,
        new Date().toLocaleDateString());
}catch(e){
    console.log(test_error(e));
}

try{
    let message = "Hello my name is Mary";
    await chatDataFunctions.postMessage(
        "meow", 
        center1._id.toString(),
        center1._id.toString(),
        message,
        new Date().toLocaleDateString());
}catch(e){
    console.log(test_error(e));
}

try{
    let message = "Hello my name is jeff";
    await chatDataFunctions.postMessage(
        User1._id.toString(), 
        center1._id.toString(),
        User1._id.toString(),
        1234,
        new Date().toLocaleDateString());
}catch(e){
    console.log(test_error(e));
}

//Testing censorship
try{
    let message = "You're a fat sack of shit";
    await chatDataFunctions.postMessage(
        User1._id.toString(), 
        center1._id.toString(),
        User1._id.toString(),
        message,
        new Date().toLocaleDateString());
}catch(e){
    console.log(test_error(e));
}

await closeConnection();