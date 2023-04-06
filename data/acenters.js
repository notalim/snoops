import { acenters } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from "../validation.js";
import { phone } from "phone";

const acenterCollection = await acenters();

const createAdoptionCenter = async (email, password, firstName, lastName, phone, address) => {

    //CHECK EMAIL
    email = validation.checkEmail(email, "email");

    //CHECK PASSWORD
    password = validation.checkString(password, "password");
    //WHAT CRITERIA FOR PASSWORD?

    //CHECK FIRSTNAME
    firstName = validation.checkString(firstName, "firstName");

    //CHECK LASTNAME
    lastName = validation.checkString(lastName, "lastName");

    //CHECK PHONE NUMBER
    //Have to check to see if NPM works here
    phone = validation.checkString(phone, "phone number");
    // let phoneCheck = phone(phone);
    // if (phoneCheck.isValid === false) {
    //     throw `Invalid phone number`;
    // }

    //CHECK ADDRESS
    address = validation.checkString(address, "address");

    let newAcenter = {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        address: address,
        img: null
    };

    const newInsertInformation = await acenterCollection.insertOne(newAcenter);
    if (newInsertInformation.insertedCount === 0) {
        throw `Could not add adoption center`;
    }

    return newAcenter;

}

const getAllAdoptionCenters = async () => {
    const acenterList = await acenterCollection.find({}).toArray();
    return acenterList;
};

const getAdoptionCenter = async (id) => {

    //CHECK ID
    id = validation.checkId(id, "id");

    const acenter = await acenterCollection.findOne({ _id: ObjectId(id) });
    if (acenter === null) {
        throw `No adoption center with id ${id} found`;
    }

    return acenter;
};

const exportedMethods = {getAllAdoptionCenters, getAdoptionCenter, createAdoptionCenter};

export default exportedMethods;
