import { users, acenters } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from "../validation.js";
import * as acenterData from "./acenters.js";

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
        img: "/assets/No_Image_Available.jpg",
        dogPreferences: {
            agePreference: null,
            sizePreferenceMax: null,
            genderPreferenceF: false,
            genderPreferenceM: false
        },
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
    address,
    agePreference,
    sizePreferenceMax,
    genderPreferenceM,
    genderPreferenceF
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

    agePreference = validation.checkOptionalMaxPrefrence(agePreference, "Age Preference");

    sizePreferenceMax = validation.checkOptionalMaxPrefrence(sizePreferenceMax, "Size Preference");

    genderPreferenceF = validation.checkBoolean(genderPreferenceF, "Gender F Preference");

    genderPreferenceM = validation.checkBoolean(genderPreferenceM, "Gender M Preference");

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
        dogPreferences: {
            agePreference: agePreference,
            sizePreferenceMax: sizePreferenceMax,
            genderPreferenceF: genderPreferenceF,
            genderPreferenceM: genderPreferenceM
        },
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

    //check if already liked in the user likedDogs
    const alreadyLiked = false;
    for(let i = 0; i < user.likedDogs.length; i++) {
        if(user.likedDogs[i]._id.toString() === dogId) {
            alreadyLiked = true;
            break;
        }
    }

    if (!alreadyLiked) {
        const updateInfo = await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            {
                $push: {
                    likedDogs: {
                        acenterId: new ObjectId(acenterId),
                        _id: new ObjectId(dogId),
                    },
                    seenDogs: {
                        acenterId: new ObjectId(acenterId),
                        _id: new ObjectId(dogId),
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

    //check if already seen in the user seenDogs
    let alreadySeen = false;
    for(let i = 0; i < user.seenDogs.length; i++) {
        if(user.seenDogs[i]._id.toString() === dogId) {
            alreadySeen = true;
            break;
        }
    }

    if(!alreadySeen) {
        const updateInfo = await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            {
                $push: {
                    seenDogs: {
                        acenterId: new ObjectId(acenterId),
                        _id: new ObjectId(dogId),
                    },
                },
            }
        );
    } else {
        throw "Dog is already seen.";
    }

    const newUser = await userCollection.findOne({ _id: new ObjectId(userId) });
    return { newUser, success: true };
};

// Get all dogs that the user has not seen yet
// ! If the user has seen all dogs, it currently throws, but we can change it to return an empty array
// limit is the number of dogs to return
// this does NOT work atm for some reason


const getUnseenDogs = async (userId, limit = 10) => {
    userId = validation.checkId(userId, "User ID");

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
        throw `User not found with this Id ${userId}`;
    }

    // const seenDogIds = user.seenDogs.map((seenDog) => seenDog.dogId);
    //const acenterCollection = await acenters();

    //Utilizing hash set here for the BEAUTIFUL O(1) lookup time.
    let seenDogs = new Set();
    for(let i = 0; i < user.seenDogs.length; i++) {
        seenDogs.add(user.seenDogs[i]._id.toString());
    }

    
    //get all the dogs, and check against the set.
    //add dogs to unseen dog list until either no more dogs at all or until limit is reached.
    const allDogs = await acenterData.default.getAllDogsFromAllAcenters();
    let unseenDogs = [];
    for(let i = 0; i < allDogs.length; i++) {
        if(unseenDogs.length >= limit) {
            break;
        }
        if(!seenDogs.has(allDogs[i]._id.toString())) {
            //account for user preferences
            console.log(user.dogPreferences)
            if( !user.dogPreferences.agePreference || user.dogPreferences.agePreference == null || user.dogPreferences.agePreference >= allDogs[i].age) {
                if(!user.dogPreferences.sizePreferenceMax || user.dogPreferences.sizePreferenceMax == null || user.dogPreferences.sizePreferenceMax >= allDogs[i].size) {
                    if(!user.dogPreferences.genderPreferenceF || user.dogPreferences.genderPreferenceF == null || (user.dogPreferences.genderPreferenceF == true && allDogs[i].gender != "F")) {
                        if(!user.dogPreferences.genderPreferenceM || user.dogPreferences.genderPreferenceM == null || (user.dogPreferences.genderPreferenceM == true && allDogs[i].gender != "M")) {
                            unseenDogs.push(allDogs[i]);
                        }
                    }
                }
            }
        }
    }

    return { dogs: unseenDogs, success: true };
    
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
