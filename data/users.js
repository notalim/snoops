import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from "../validation.js";

const userCollection = await users();

const getAllUsers = async () => {
    const userList = await userCollection.find({}).toArray();
    return userList;
};

const createUser = async (
    email,
    password,
    firstName,
    lastName,
    age,
    phone,
    address
) => {
    const userCollection = await users();

    // Check email
    const user = await userCollection.findOne({ email: email });
    if (user) {
        throw `User with email ${email} already exists`;
    }
    email = validation.checkEmail(email, "email");

    // Check password
    password = validation.checkPassword(password, "password");

    // Check first name
    firstName = validation.checkName(firstName, "firstName");

    // Check last name
    lastName = validation.checkName(lastName, "lastName");

    // Check age
    age = validation.checkLegalAge(age, "age");

    // Check phone number
    phone = validation.checkPhone(phone, "phone number");

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
        likedDogs: [],
        seenDogs: []
    };

    const newInsertInformation = await userCollection.insertOne(newUser);
    if (newInsertInformation.insertedCount === 0) {
        throw `Could not add adoption center`;
    }

    return newUser;
};

const getUser = async (id) => {
    id = validation.checkId(id, "User ID");

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
        throw `User not found with this Id ${id}`;
    }
    return user;
};

const deleteUser = async (id) => {
    id = validation.checkId(id, "User ID");
    const userCollection = await users();
    const deletionInfo = await userCollection.findOneAndDelete({
        _id: new ObjectId(id),
    });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete adoption center with ID ${id}`;
    }
    return { id, deleted: true };
};

const updateUser = async (
    id,
    email,
    password,
    firstName,
    lastName,
    age,
    phone,
    address
) => {
    let validatedId = validation.checkId(id, "User ID");

    // Check email

    email = validation.checkEmail(email, "email");

    // Check password
    password = validation.checkPassword(password, "password");

    // Check first name
    firstName = validation.checkName(firstName, "firstName");

    // Check last name
    lastName = validation.checkName(lastName, "lastName");

    // Check age
    age = validation.checkLegalAge(age, "age");

    // Check phone number
    phone = validation.checkPhone(phone, "phone number");

    // Check address
    address = validation.checkString(address, "address");

    // Initialize image to null, dogPreferences to empty object, likedDogsIds to empty array

    const oldUser = await getUser(validatedId);

    const updatedUser = {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        age: age,
        phone: phone,
        address: address,
        img: oldUser.img,
        dogPreferences: oldUser.dogPreferences,
        likedDogs: oldUser.likedDogs,
        seenDogs: oldUser.seenDogs
    };

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
        { _id: new ObjectId(validatedId) },
        { $set: updatedUser }
    );

    if (updateInfo.modifiedCount === 0) {
        throw `Could not update user with ID ${validatedId}`;
    }

    return await getUser(validatedId);
};

const loginUser = async (email, password) => {
    email = validation.checkEmail(email, "email");

    const user = await userCollection.findOne({ email: email });
    if (!user) {
        throw `User with email ${email} does not exist`;
    }

    if (!validation.verifyPassword(password, user.password)) {
        throw `Incorrect password`;
    }

    return { user, success: true };
};

const likeDog = async (userId, acenterId, dogId) => {

    userId = validation.checkId(userId, "User ID");
    acenterId = validation.checkId(acenterId, "Adoption Center ID");
    dogId = validation.checkId(dogId, "Dog ID");

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
        throw `User not found with this Id ${userId}`;
    }

    // ? Is there a case where a dog is already liked?

    user.likedDogsIds.push({ acenterId: new ObjectId(acenterId), dogId: new ObjectId(dogId)});

    const updateInfo = await userCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: user }
    );

    return { user, success: true };
}

const exportedMethods = {
    getAllUsers,
    createUser,
    getUser,
    deleteUser,
    updateUser,
    loginUser,
    likeDog,
};

export default exportedMethods;
