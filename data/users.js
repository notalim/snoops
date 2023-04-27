import { users, acenters } from "../config/mongoCollections.js";
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
    dob,
    phone,
    address
) => {
    const userCollection = await users();

    // Check email
    const user = await userCollection.findOne({ email: email });
    if (user) {
        throw `User with email ${email} already exists`;
    }
    email = validation.checkEmail(email, "Email");

    // Check password
    password = validation.checkPassword(password, "Password");

    // Check first name
    firstName = validation.checkName(firstName, "First Name");

    // Check last name
    lastName = validation.checkName(lastName, "Last Name");

    // Check age
    dob = validation.checkDate(dob, "User Date of Birth");

    // Check phone number
    phone = validation.checkPhone(phone, "Phone number");

    // Check address
    address = validation.checkString(address, "Address");

    //Get LAT & LONG If possible
    let location;
    try {
        location = await validation.getLatLong(address, "Address");
    } catch (e) {
        throw e;
    }

    // Initialize image to null, dogPreferences to empty object, likedDogsIds to empty array

    let newUser = {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        phone: phone,
        address: address,
        img: null,
        dogPreferences: {},
        likedDogs: [],
        seenDogs: [],
        location: location,
    };

    const newInsertInformation = await userCollection.insertOne(newUser);
    if (newInsertInformation.insertedCount === 0) {
        throw `Could not add a user with email ${email}`;
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
    dob,
    phone,
    address
) => {
    let validatedId = validation.checkId(id, "User ID");

    // Check email

    email = validation.checkEmail(email, "Email");

    // Check password
    if (password !== undefined && password !== null && password !== "") {
        password = validation.checkPassword(password, "Password");
    } else {
        const user = await getUser(validatedId);
        password = user.password;
    }
    // Check first name
    firstName = validation.checkName(firstName, "First Name");

    // Check last name
    lastName = validation.checkName(lastName, "Last Name");

    // Check age
    dob = validation.checkDate(dob, "User Date of Birth");

    // Check phone number
    phone = validation.checkPhone(phone, "Phone number");

    // Check address
    address = validation.checkString(address, "Address");

    //Get new LAT & LONG if possible
    let location;
    try {
        location = await validation.getLatLong(address, "Address");
    } catch (e) {
        throw e;
    }

    // Initialize image to null, dogPreferences to empty object, likedDogsIds to empty array

    const oldUser = await getUser(validatedId);

    const updatedUser = {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        phone: phone,
        address: address,
        img: oldUser.img,
        dogPreferences: oldUser.dogPreferences,
        likedDogs: oldUser.likedDogs,
        seenDogs: oldUser.seenDogs,
        location: location,
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

    return user;
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

    const alreadyLiked = user.likedDogs.some(
        (entry) =>
            entry.acenterId.toString() === acenterId &&
            entry.dogId.toString() === dogId
    );

    if (!alreadyLiked) {
        const updateInfo = await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            {
                $push: {
                    likedDogs: {
                        acenterId: new ObjectId(acenterId),
                        dogId: new ObjectId(dogId),
                    },
                    seenDogs: {
                        acenterId: new ObjectId(acenterId),
                        dogId: new ObjectId(dogId),
                    },
                },
            }
        );
    } else {
        throw "Dog is already liked.";
    }
    const newUser = await userCollection.findOne({ _id: new ObjectId(userId) });
    return { newUser, success: true };
};

// Same as likeDog, but with different alias
// This is to make the code more readable
const swipeRight = async (userId, acenterId, dogId) => {
    return likeDog(userId, acenterId, dogId);
};

const swipeLeft = async (userId, acenterId, dogId) => {
    userId = validation.checkId(userId, "User ID");
    acenterId = validation.checkId(acenterId, "Adoption Center ID");
    dogId = validation.checkId(dogId, "Dog ID");

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
        throw `User not found with this Id ${userId}`;
    }

    const updateInfo = await userCollection.updateOne(
        { _id: new ObjectId(userId) },
        {
            $push: {
                seenDogs: {
                    acenterId: new ObjectId(acenterId),
                    dogId: new ObjectId(dogId),
                },
            },
        }
    );

    return { user, success: true };
};

// Get all dogs that the user has not seen yet
// ! If the user has seen all dogs, it currently throws, but we can change it to return an empty array
// limit is the number of dogs to return
const getUnseenDogs = async (userId, limit = 10) => {
    userId = validation.checkId(userId, "User ID");

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
        throw `User not found with this Id ${userId}`;
    }

    const seenDogIds = user.seenDogs.map((seenDog) => seenDog.dogId);

    const acenterCollection = await acenters();

    const unseenDogs = await acenterCollection
        .aggregate([
            { $unwind: "$dogList" },
            {
                $match: {
                    "dogList._id": {
                        $nin: seenDogIds.map((id) => new ObjectId(id)),
                    },
                },
            },
            { $limit: limit },
            { $project: { dog: "$dogList", _id: 0 } },
        ])
        .toArray();

    if (!unseenDogs || unseenDogs.length === 0) {
        return { dogs: [], success: true };
    }

    return { dogs: unseenDogs.map((entry) => entry.dog), success: true };
};

const exportedMethods = {
    getAllUsers,
    createUser,
    getUser,
    deleteUser,
    updateUser,
    loginUser,
    likeDog,
    swipeLeft,
    swipeRight,
    getUnseenDogs,
};

export default exportedMethods;
