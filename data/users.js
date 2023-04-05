import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from "../validation.js";
import { phone } from "phone";

const userCollection = await users();

export const getAllUsers = async () => {
    const userList = await userCollection.find({}).toArray();
    return userList;
};
export const addUser = async (
    email,
    password,
    firstName,
    lastName,
    age,
    phone,
    address
) => {
    //CHECKING IF VARS PRESENT
    email = validation.isVariableThere(email, "email");
    password = validation.isVariableThere(password, "password");
    firstName = validation.isVariableThere(firstName, "firstName");
    lastName = validation.isVariableThere(lastName, "lastName");
    age = validation.isVariableThere(age, "age");
    phone = validation.isVariableThere(phone, "phone");
    address = validation.isVariableThere(address, "address");

    //CHECK EMAIL
    email = validation.checkString(email, "email");
    email = validation.checkEmail(email, "email");

    //CHECK PASSWORD
    password = validation.checkString(password, "password");
    //WHAT CRITERIA FOR PASSWORD?

    //CHECK FIRSTNAME
    firstName = validation.checkString(firstName, "firstName");
    //ANY OTHER CHECKS HERE?

    //CHECK LASTNAME
    lastName = validation.checkString(lastName, "lastName");
    //SAME HERE

    //CHECK AGE
    age = validation.checkNumber(age, "age");
    if (age < 18) {
        throw `User must be at least 18 years old`;
    }

    //CHECK PHONE NUMBER
    //Have to check to see if NPM works here
    phone = validation.checkString(phone, "phone number");
    let phoneCheck = phone(phone);
    if (phoneCheck.isValid === false) {
        throw `Invalid phone number`;
    }

    //CHECK ADDRESS
    address = validation.checkString(address, "address");
    //What criteria for this

    //SHOULD WE CHECK IMG OR INITIALIZE TO NULL

    let newUser = {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        age: age,
        phone: phone,
        address: address,
        img: null,
        dogPreferences: {},
        likedDogsIds: [],
    };
    //SHOULD WE CHECK IF THERE ARE DUP USERS, EX: SAME FIRST AND LAST
    const userCollection = await users();
    const newInsertInformation = await userCollection.insertOne(newUser);
    if (!newInsertInformation.insertedId) {
        throw `Insert failed!`;
    }

    //Want to return the get method just to check if its there so have to implement
};
export const getUserById = async (id) => {
    id = validation.checkId(id, "User ID");
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(id) });
    if (!user) {
        throw "User not found";
    }
    return user;
};

export const removeUser = async (id) => {
    id = validation.checkId(id, "User ID");
    const userCollection = await users();
    const deletionInfo = await userCollection.findOneAndDelete({
        _id: ObjectId(id),
    });
    if (deletionInfo.lastErrorObject.n === 0) {
        throw [404, `Error: Could not delete user with id of ${id}`];
    }
    return { id, deleted: true };
};

const exportedMethods = { getAllUsers, addUser, getUserById, removeUser };

export default exportedMethods;
