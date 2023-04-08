import { acenters } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from "../validation.js";

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

    const acenter = await acenterCollection.findOne({ email: email });
    if (acenter) {
        throw `Adoption center with email ${email} already exists`;
    }

    // ? do we check the users collection too?

    email = validation.checkEmail(email, "Email");

    // Check name
    name = validation.checkString(name, "Name");

    // Check password
    password = validation.checkPassword(password, "Password");

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
    const acenter2 = await acenterCollection.findOne({ phone: phone });
    if (acenter2) {
        throw `Adoption center with phone ${phone} already exists`;
    }

    phone = validation.checkPhone(phone, "Phone number");

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
    address
) => {
    // Check id
    id = validation.checkId(id, "ID");

    // Check email
    const acenter = await acenterCollection.findOne({ email: email });
    if (acenter) {
        throw `Adoption center with email ${email} already exists`;
    }
    email = validation.checkEmail(email, "Email");

    // Check name
    name = validation.checkString(name, "Name");

    // Check password
    password = validation.checkPassword(password, "Password");

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
    const acenter2 = await acenterCollection.findOne({ phone: phone });
    if (acenter2) {
        throw `Adoption center with phone ${phone} already exists`;
    }

    phone = validation.checkPhone(phone, "Phone number");

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

const createDog = async (
    acenterId,
    dogName,
    dogDOB,
    dogBreeds,
    dogGender,
    dogSize
) => {
    // Check acenterId
    acenterId = validation.checkId(acenterId, "ID");

    // Check dogName
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
        _id: new ObjectId(),
        name: dogName,
        dob: dogDOB,
        breeds: dogBreeds,
        gender: dogGender,
        size: dogSize,
        img: null,
        description: null,
        adoptionStatus: null,
    };

    const updatedInfo = await acenterCollection.updateOne(
        { _id: new ObjectId(acenterId) },
        { $push: { dogList: newDog } }
    );

    if (updatedInfo.modifiedCount === 0) {
        throw `Could not add dog to adoption center with ID ${acenterId}`;
    }

    return await getDogFromAcenter(acenterId, newDog._id.toString());
};

const getAllDogs = async (acenterId) => {
    acenterId = validation.checkId(acenterId, "ID");

    const acenter = await acenterCollection.findOne({
        _id: new ObjectId(acenterId),
    });
    if (acenter === null) {
        throw `No adoption center with ID ${acenterId} found`;
    }

    return acenter.dogList;
};

const getDogFromAcenter = async (acenterId, dogId) => {
    acenterId = validation.checkId(acenterId, "ID");
    dogId = validation.checkId(dogId, "ID");

    const acenter = await acenterCollection.findOne({
        _id: new ObjectId(acenterId),
    });

    if (acenter === null) {
        throw `No adoption center with ID ${acenterId} found`;
    }

    let dog = null;
    for (let i = 0; i < acenter.dogList.length; i++) {
        // console.log(acenter.dogList);
        let curr_dog = acenter.dogList[i];
        if (curr_dog["_id"].toString() === dogId) {
            dog = acenter.dogList[i];
            break;
        }
    }

    if (dog === null) {
        throw `No dog with ID ${dogId} found in adoption center ${acenter.name}`;
    }

    return dog;
};

const updateDog = async (
    acenterId,
    dogId,
    dogName,
    dogDOB,
    dogBreeds,
    dogGender,
    dogSize
) => {
    acenterId = validation.checkId(acenterId, "ID");
    dogId = validation.checkId(dogId, "ID");

    // get the old dog info
    let oldDog = await getDogFromAcenter(acenterId, dogId);

    // console.log(oldDog);

    // Check dogName
    // ? Do we use Check Name or Check String?
    dogName = validation.checkString(dogName, "Dog name");

    // Check dogDOB
    // ? Do we use Check Age or Check String?
    // ? How do we store age?
    dogDOB = validation.checkDate(dogDOB, "Dog Date of Birth");

    // Check dogBreeds
    dogBreeds = validation.checkStringArray(dogBreeds, "Dog breeds");

    // Check dogGender
    dogGender = validation.checkGender(dogGender, "Dog gender");

    // Check dogSize
    dogSize = validation.checkPetWeight(dogSize, "Dog size");

    const updatedDog = {
        _id: new ObjectId(dogId),
        name: dogName,
        dob: dogDOB,
        breeds: dogBreeds,
        gender: dogGender,
        size: dogSize,
        img: oldDog.img,
        description: oldDog.description,
        adoptionStatus: oldDog.adoptionStatus,
    };

    const updatedInfo = await acenterCollection.updateOne(
        { _id: new ObjectId(acenterId), "dogList._id": new ObjectId(dogId) },
        { $set: { "dogList.$": updatedDog } }
    );

    if (updatedInfo.modifiedCount === 0) {
        throw `Could not update dog with ID ${dogId} in adoption center with ID ${acenterId}`;
    }

    return await getDogFromAcenter(acenterId, dogId);
};

const deleteDog = async (acenterId, dogId) => {
    acenterId = validation.checkId(acenterId, "ID");
    dogId = validation.checkId(dogId, "ID");

    const deletionInfo = await acenterCollection.updateOne(
        { _id: new ObjectId(acenterId) },
        { $pull: { dogList: { _id: new ObjectId(dogId) } } }
    );

    if (deletionInfo.modifiedCount === 0) {
        throw `Could not delete dog with ID ${dogId} from adoption center with ID ${acenterId}`;
    }
};

const exportedMethods = {
    getAllAdoptionCenters,
    getAdoptionCenter,
    createAdoptionCenter,
    updateAdoptionCenter,
    deleteAdoptionCenter,
    createDog,
    getAllDogs,
    getDogFromAcenter,
    updateDog,
    deleteDog,
};

export default exportedMethods;
