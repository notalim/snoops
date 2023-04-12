import { dbConnection, closeConnection } from "../config/mongoConnection.js";

import chatDataFunctions from "../data/chats.js";
import acenterDataFunctions from "../data/acenters.js";
import userDataFunctions from "../data/users.js";

const db = await dbConnection();
await db.dropDatabase();


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
    age: 20,
    phone: "9295054335",
    address: "1 Campus Drive, Stony Brook, NY 11794",
};

let user2 = {
    email: "akassymov@test.com",
    password: "Passw!2105",
    firstName: "Alim",
    lastName: "Kassymov",
    age: 20,
    phone: "9295054336",
    address: "Main Street, New York, NY 10001",
};

let user3 = {
    email: "ndimeglio@test.com",
    password: "Passw2_425",
    firstName: "Nick",
    lastName: "Dimeglio",
    age: 20,
    phone: "9295054337",
    address: "Mt. Sinai Hospital, New York, NY 10029",
};

let user4 = {
    email: "khalton@test.com",
    password: "P$assw242534",
    firstName: "Kyle",
    lastName: "Halton",
    age: 20,
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
    user1.age,
    user1.phone,
    user1.address
);

let User2 = await userDataFunctions.createUser(
    user2.email,
    user2.password,
    user2.firstName,
    user2.lastName,
    user2.age,
    user2.phone,
    user2.address
);

let User3 = await userDataFunctions.createUser(
    user3.email,
    user3.password,
    user3.firstName,
    user3.lastName,
    user3.age,
    user3.phone,
    user3.address
);

let User4 = await userDataFunctions.createUser(
    user4.email,
    user4.password,
    user4.firstName,
    user4.lastName,
    user4.age,
    user4.phone,
    user4.address
);


//############ TESTING CHATS ##############

try{
    await chatDataFunctions.createChat(User1._id.toString(), center1._id.toString());
    console.log(`Created chat between ${User1._id.toString()} and ${center1._id.toString()}`);
}catch(e){
    console.log(`Error while creating chat between ${User1._id.toString()} and ${center1._id.toString()}`);
    console.log(e);
}

try{

}catch(e){
    console.log(e);
}

try{

}catch(e){
    console.log(e);
}

try{

}catch(e){
    console.log(e);
}

try{

}catch(e){
    console.log(e);
}


await closeConnection();