import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from "../validation.js";
import { phone } from "phone";

const userCollection = await users();

const getAllUsers = async () => {
    const userList = await userCollection.find({}).toArray();
    return userList;
};
const addUser = async (
    email,
    password,
    firstName,
    lastName,
    age,
    phone,
    address
) => {
    // Check email
    // ! check if an email already exists
    email = validation.checkEmail(email, "email");

    // Check password
    // ! Validate password criteria
    password = validation.checkString(password, "password");

    // Check first name
    firstName = validation.checkName(firstName, "firstName");

    // Check last name
    lastName = validation.checkName(lastName, "lastName");

    // Check age
    age = validation.checkLegalAge(age, "age");

    // Check phone number
    // ! Validate phone number criteria
    // Have to check to see if NPM works here
    phone = validation.checkString(phone, "phone number");
    let phoneCheck = phone(phone);
    if (phoneCheck.isValid === false) {
        throw `Invalid phone number`;
    }

    // Check address
    address = validation.checkString(address, "address");

    // Initialize image to null, dogPreferences to empty object, likedDogsIds to empty array

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
    
    const userCollection = await users();
    const newInsertInformation = await userCollection.insertOne(newUser);
    if (!newInsertInformation.insertedId) {
        throw `Insert failed!`;
    }

    return await getUser(newInsertInformation.insertedId);
};
const getUser = async (id) => {
    id = validation.checkId(id, "User ID");

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(id) });
    if (!user) {
        throw "User not found";
    }
    return user;
};

const removeUser = async (id) => {
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

const exportedMethods = { getAllUsers, addUser, getUser, removeUser };

export default exportedMethods;
