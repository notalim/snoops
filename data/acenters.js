import { acenters } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from "../validation.js";
import { phone } from "phone";

const acenterCollection = await acenters();

const createAdoptionCenter = async (
    email,
    name,
    password,
    contactFirstName,
    contactLastName,
    phone,
    address
) => {
    // Check email
    // ! check if an email already exists
    email = validation.checkEmail(email, "Email");

    // Check name
    name = validation.checkString(name, "Name");

    // Check password
    // ! Validate password criteria
    password = validation.checkString(password, "Password");

    // Check contact first name
    contactFirstName = validation.checkName(
        contactFirstName,
        "Contact First Name"
    );

    // Check contact last name
    contactLastName = validation.checkName(
        contactLastName,
        "Contact Last Name"
    );

    // Check phone number
    // ! check if a phone number already exists
    // Have to check to see if NPM works here
    phone = validation.checkString(phone, "Phone number");
    // let phoneCheck = phone(phone);
    // if (phoneCheck.isValid === false) {
    //     throw `Invalid phone number`;
    // }

    // Check address
    address = validation.checkString(address, "Address");

    let newAcenter = {
        email: email,
        name: name,
        password: password,
        contactFirstName: contactFirstName,
        contactLastName: contactLastName,
        phone: phone,
        address: address,
        workingHours: null,
        website: null,
        img: null,
        dogList: [],
    };

    const newInsertInformation = await acenterCollection.insertOne(newAcenter);
    if (newInsertInformation.insertedCount === 0) {
        throw `Could not add adoption center`;
    }

    return newAcenter;
};

const getAllAdoptionCenters = async () => {
    const acenterList = await acenterCollection.find({}).toArray();
    return acenterList;
};

const getAdoptionCenter = async (id) => {
    id = validation.checkId(id, "ID");

    const acenter = await acenterCollection.findOne({ _id: new ObjectId(id) });
    if (acenter === null) {
        throw `No adoption center with ID ${id} found`;
    }

    return acenter;
};

const updateAdoptionCenter = async (
    id,
    email,
    name,
    password,
    contactFirstName,
    contactLastName,
    phone,
    address,
) => {
    // Check id
    id = validation.checkId(id, "ID");

    // Check email
    // ! check if an email already exists
    email = validation.checkEmail(email, "Email");

    // Check name
    name = validation.checkString(name, "Name");

    // Check password
    // ! Validate password criteria
    password = validation.checkString(password, "Password");

    // Check contact first name
    contactFirstName = validation.checkName(
        contactFirstName,
        "Contact First Name"
    );

    // Check contact last name
    contactLastName = validation.checkName(
        contactLastName,
        "Contact Last Name"
    );

    // Check phone number
    // ! check if a phone number already exists
    // Have to check to see if NPM works here
    phone = validation.checkString(phone, "Phone number");

    // Check address
    address = validation.checkString(address, "Address");

    const updatedAcenter = {
        email: email,
        name: name,
        password: password,
        contactFirstName: contactFirstName,
        contactLastName: contactLastName,
        phone: phone,
        address: address,
        img: null,
    };

    // ? How do we update the working hours and website?
    // ? Separate functions?

    const updatedInfo = await acenterCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedAcenter }
    );

    if (updatedInfo.modifiedCount === 0) {
        throw `Could not update adoption center with ID ${id}`;
    }

    return await getAdoptionCenter(id);
};

const deleteAdoptionCenter = async (id) => {
    id = validation.checkId(id, "ID");

    const deletionInfo = await acenterCollection.deleteOne({
        _id: new ObjectId(id),
    });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete adoption center with ID ${id}`;
    }
};

const createDog = async (acenterId, dogName, dogDOB, dogBreeds, dogGender, dogSize) => {
    // Check acenterId
    acenterId = validation.checkId(acenterId, "ID");

    // Check dogName
    // ? Do we use Check Name or Check String?
    dogName = validation.checkString(dogName, "Dog Name");

    // Check dogDOB
    // ? Do we use Check Age or Check String?
    // ? How do we store age?
    dogDOB = validation.checkDate(dogDOB, "Dog DOB");

    // Check dogBreeds
    dogBreeds = validation.checkStringArray(dogBreeds, "Dog Breeds");

    // Check dogGender
    dogGender = validation.checkGender(dogGender, "Dog Gender");

    // Check dogSize
    dogSize = validation.checkPetWeight(dogSize, "Dog Size");

    let newDog = {
        name: dogName,
        dob: dogDOB,
        breeds: dogBreeds,
        gender: dogGender,
        size: dogSize,
        img: null,
        description: null,
        adoptionStatus: null
    }

    const updatedInfo = await acenterCollection.updateOne(
        { _id: new ObjectId(acenterId) },
        { $push: { dogList: newDog } }
    );

    if (updatedInfo.modifiedCount === 0) {
        throw `Could not add dog to adoption center with ID ${acenterId}`;
    }

    return await getAdoptionCenter(acenterId);
}

const getAllDogs= async (acenterId) => {
    acenterId = validation.checkId(acenterId, "ID");

    const acenter = await acenterCollection.findOne({ _id: new ObjectId(acenterId) });
    if (acenter === null) {
        throw `No adoption center with ID ${acenterId} found`;
    }

    return acenter.dogList;
}

const exportedMethods = {
    getAllAdoptionCenters,
    getAdoptionCenter,
    createAdoptionCenter,
    updateAdoptionCenter,
    deleteAdoptionCenter,
    createDog,
    getAllDogs,
};

export default exportedMethods;
