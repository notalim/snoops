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

    //Get LAT & LONG if possible
    let location;
    try {
        location = await validation.getLatLong(address, "Address");
    } catch (e) {
        throw e;
    }

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
        img: "/assets/No_Image_Available.jpg",
        dogList: [],
        location: location,
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
    image
) => {
    // Check id
    id = validation.checkId(id, "ID");

    // Check email
    const acenter = await acenterCollection.findOne({ id: !id, email: email });
    if (acenter) {
        throw `Adoption center with email ${email} already exists`;
    }
    email = validation.checkEmail(email, "Email");

    // Check name
    name = validation.checkString(name, "Name");

    // Check password
    if (password !== undefined && password !== null && password !== "") {
        password = validation.checkPassword(password, "Password");
    } else {
        const acenter = await getAdoptionCenter(id);
        password = acenter.password;
    }

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
    const acenter2 = await acenterCollection.findOne({ id: !id, phone: phone });
    if (acenter2) {
        throw `Adoption center with phone ${phone} already exists`;
    }

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

    const updatedAcenter = {
        email: email,
        name: name,
        password: password,
        contactFirstName: contactFirstName,
        contactLastName: contactLastName,
        phone: phone,
        address: address,
        img: image,
        location: location
    };

    // ! update every dog in the acenter with the new address
    // how?
    // can manually update every dog (dumb)
    // or can get all dogs, update them, and then update the acenter
    // !


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
    return { id, deleted: true };
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
    dogDOB = validation.checkDate(dogDOB, "Date of Birth", 0, 20);

    // Check dogBreeds
    dogBreeds = validation.checkStringArray(dogBreeds, "Dog Breeds");

    //turn the first letter of each breed to uppercase
    dogBreeds = dogBreeds.map((breed) => {
        let breedStartLetter = breed.charAt(0);
        let restOfBreed = breed.slice(1);
        return breedStartLetter.toUpperCase() + restOfBreed;
    });

    // Check dogGender
    dogGender = validation.checkGender(dogGender, "Dog Gender");

    // Check dogSize
    dogSize = validation.checkPetWeight(dogSize, "Dog Size");

    // Gets the random placeholder image
    function getRandomDogPlaceholder() {
        const min = 1;
        const max = 16;
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        return `/assets/dog-placeholders/dog-placeholder-${randomNum}.png`;
    }

    let acenter = await getAdoptionCenter(acenterId);

    let newDog = {
        _id: new ObjectId(),
        acenterId: new ObjectId(acenterId),
        name: dogName,
        dob: dogDOB,
        breeds: dogBreeds,
        gender: dogGender,
        size: dogSize,
        img: getRandomDogPlaceholder(),
        location: acenter.location,
        description: null,
        adoptionStatus: "Available",
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

//can likely simplify this if we use acenterId as a foreign key in the dog schema
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

const dogExists = async (acenterId, dogId) => {
    try {
        const dog = await getDogFromAcenter(acenterId, dogId);
        return !!dog;
    } catch (error) {
        return false;
    }
}

const updateDog = async (
    acenterId,
    dogId,
    dogName,
    dogDOB,
    dogBreeds,
    dogGender,
    dogSize,
    dogAdoptionStatus,
    dogImage
) => {
    acenterId = validation.checkId(acenterId, "ID");
    dogId = validation.checkId(dogId, "ID");

    // get the old dog info
    let oldDog = await getDogFromAcenter(acenterId, dogId);

    // Check dogName
    // ? Do we use Check Name or Check String?
    dogName = validation.checkString(dogName, "Dog name");

    // Check dogDOB
    dogDOB = validation.checkDate(dogDOB, "Dog Date of Birth", 0, 20);

    // Check dogBreeds
    dogBreeds = validation.checkStringArray(dogBreeds, "Dog breeds");

    //turn the first letter of each breed to uppercase
    dogBreeds = dogBreeds.map((breed) => {
        let breedStartLetter = breed.charAt(0);
        let restOfBreed = breed.slice(1);
        return breedStartLetter.toUpperCase() + restOfBreed;
    });

    // Check dogGender
    dogGender = validation.checkGender(dogGender, "Dog gender");

    // Check dogSize
    dogSize = validation.checkPetWeight(dogSize, "Dog size");

    dogAdoptionStatus = validation.checkString(dogAdoptionStatus, "Dog Adoption Status");

    const updatedDog = {
        _id: new ObjectId(dogId),
        acenterId: new ObjectId(acenterId),
        name: dogName,
        dob: dogDOB,
        breeds: dogBreeds,
        gender: dogGender,
        size: dogSize,
        img: dogImage,
        location: oldDog.location,
        description: oldDog.description,
        adoptionStatus: dogAdoptionStatus,
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

// only updates the location of the dog

const updateDogLocation = async (acenterId, dogId, newLocation) => {
    acenterId = validation.checkId(acenterId, "ID");
    dogId = validation.checkId(dogId, "ID");

    // get the old dog info
    let oldDog = await getDogFromAcenter(acenterId, dogId);

    const updatedDog = {
        ...oldDog,
        location: newLocation,
    }

    const updatedInfo = await acenterCollection.updateOne(
        { _id: new ObjectId(acenterId), "dogList._id": new ObjectId(dogId) },
        { $set: { "dogList.$": updatedDog } }
    );

    return await getDogFromAcenter(acenterId, dogId);
}

const deleteDog = async (acenterId, dogId) => {
    acenterId = validation.checkId(acenterId, "ID");
    dogId = validation.checkId(dogId, "ID");

    let oldDog = await getDogFromAcenter(acenterId, dogId);

    const deletionInfo = await acenterCollection.updateOne(
        { _id: new ObjectId(acenterId) },
        { $pull: { dogList: { _id: new ObjectId(dogId) } } }
    );

    if (deletionInfo.modifiedCount === 0) {
        throw `Could not delete dog with ID ${dogId} from adoption center with ID ${acenterId}`;
    }
    return { id: dogId, deleted: true };
};

const logInAdoptionCenter = async (acenterEmail, acenterPassword) => {
    acenterEmail = validation.checkEmail(acenterEmail, "email");

    const acenter = await acenterCollection.findOne({ email: acenterEmail });
    if (!acenter) {
        throw `Adoption center with email ${acenterEmail} does not exist`;
    }

    if (!validation.verifyPassword(acenterPassword, acenter.password)) {
        throw `Incorrect password`;
    }

    return acenter;
};

const getAllDogsFromAllAcenters = async () => {
    const acenterList = await acenterCollection.find({}).toArray();
    let dogList = [];
    for (let i = 0; i < acenterList.length; i++) {
        dogList = dogList.concat(acenterList[i].dogList);
    }
    return dogList;
};

const exportedMethods = {
    getAllAdoptionCenters,
    getAdoptionCenter,
    createAdoptionCenter,
    updateAdoptionCenter,
    deleteAdoptionCenter,
    logInAdoptionCenter,
    createDog,
    getAllDogs,
    getDogFromAcenter,
    dogExists,
    updateDog,
    updateDogLocation,
    deleteDog,
    getAllDogsFromAllAcenters,
};

export default exportedMethods;
