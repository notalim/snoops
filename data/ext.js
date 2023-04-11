import { acenters, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import userData from "./users.js";
import acenterData from "./acenters.js";
import * as validation from "../validation.js";

const acenterCollection = await acenters();
const userCollection = await users();

const acenterUpdateImage = async (id, image) => {
    // Check id
    id = validation.checkId(id, "ID");

    // Check image
    // ? How do we do that?

    const acenter = await acenterCollection.findOne({ _id: ObjectId(id) });
    if (!acenter) {
        throw `Adoption center with id ${id} does not exist`;
    }

    const updatedAcenter = await acenterCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { image: image } }
    );

    if (updatedAcenter.modifiedCount === 0) {
        throw `Could not update adoption center with ID ${id}`;
    }

    return await acenterData.getAdoptionCenter(id);
};

const userUpdateImage = async (id, image) => {
    // Check id
    id = validation.checkId(id, "ID");

    // Check image
    // ? How do we do that?

    const user = await userCollection.findOne({ _id: ObjectId(id) });
    if (!user) {
        throw `User with id ${id} does not exist`;
    }

    const updatedUser = await userCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { image: image } }
    );

    if (updatedUser.modifiedCount === 0) {
        throw `Could not update user with ID ${id}`;
    }

    return await userData.getUser(id);
};

// TODO: Add more functions?

const exportedMethods = {
    acenterUpdateImage,
    userUpdateImage,
};

export default exportedMethods;
