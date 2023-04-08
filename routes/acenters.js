import { Router } from "express";
const router = Router();
import { acenterData, userData } from "../data/index.js";
import * as validation from "../validation.js";

// TODO: Adoption Centers Routes

// TODO: GET /acenters - Get all adoption centers

router.route("/").get(async (req, res) => {
    try {
        const acenters = await acenterData.getAllAdoptionCenters();
        return res.status(200).json(acenters);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// TODO: GET /acenters/:id - Get adoption center by id

router.route("/:id").get(async (req, res) => {
    // Validate the id
    let id = req.params.id;
    id = validation.checkId(id, "ID");

    try {
        const acenter = await acenterData.getAdoptionCenter(req.params.id);
        return res.status(200).json(acenter);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// TODO: POST /acenters - Create adoption center

router.route("/").post(async (req, res) => {
    // Decompose request body

    let {
        email,
        name,
        password,
        contactFirstName,
        contactLastName,
        phone,
        address,
    } = req.body;

    // Validate request body

    email = validation.checkEmail(email, "Email");

    name = validation.checkString(name, "Name");

    password = validation.checkPassword(password, "Password");

    contactFirstName = validation.checkName(
        contactFirstName,
        "Contact First Name"
    );

    contactLastName = validation.checkName(
        contactLastName,
        "Contact Last Name"
    );

    phone = validation.checkPhone(phone, "Phone");

    address = validation.checkString(address, "Address");

    try {
        const acenter = await acenterData.createAdoptionCenter(
            email,
            name,
            password,
            contactFirstName,
            contactLastName,
            phone,
            address
        );
        return res.status(200).json(acenter);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// TODO: PUT /acenters/:id - Update adoption center

router.route("/:id").put(async (req, res) => {
    // Validate the id
    let id = req.params.id;
    id = validation.checkId(id, "ID");
    // Decompose request body

    let {
        email,
        name,
        password,
        contactFirstName,
        contactLastName,
        phone,
        address,
    } = req.body;

    // Validate request body

    email = validation.checkEmail(email, "Email");

    name = validation.checkString(name, "Name");

    password = validation.checkPassword(password, "Password");

    contactFirstName = validation.checkName(
        contactFirstName,
        "Contact First Name"
    );

    contactLastName = validation.checkName(
        contactLastName,
        "Contact Last Name"
    );

    phone = validation.checkPhone(phone, "Phone");

    address = validation.checkString(address, "Address");

    try {
        const acenter = await acenterData.updateAdoptionCenter(
            req.params.id,
            email,
            name,
            password,
            contactFirstName,
            contactLastName,
            phone,
            address
        );

        return res.status(200).json(acenter);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// TODO: DELETE /acenters/:id - Delete adoption center

router.route("/:id").delete(async (req, res) => {
    // Validate the id
    let id = req.params.id;
    id = validation.checkId(id, "ID");

    try {
        const acenter = await acenterData.deleteAdoptionCenter(req.params.id);
        return res.status(200).json({ message: "Adoption Center deleted" });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// TODO: POST /acenters/:id/dogs - Create dog for adoption center

router.route("/:id/dogs").post(async (req, res) => {
    // Validate the id
    let id = req.params.id;
    id = validation.checkId(id, "Adoption center ID");

    // Decompose request body
    let { name, dob, breeds, gender, size } = req.body;

    // Validate request body
    name = validation.checkString(name, "Name");

    dob = validation.checkDate(dob, "Date of Birth");

    breeds = validation.checkStringArray(breeds, "Breeds");

    gender = validation.checkGender(gender, "Gender");

    size = validation.checkPetWeight(size, "Weight");

    try {
        const dog = await acenterData.createDog(id, name, dob, breeds, gender, size);
        return res.status(200).json(dog);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// TODO: GET /acenters/:id/dogs - Get all dogs from adoption center

router.route("/:id/dogs").get(async (req, res) => {
    // Validate the id
    let id = req.params.id;

    id = validation.checkId(id, "Adoption center ID");

    try {
        const dogs = await acenterData.getAllDogs(id);
        return res.status(200).json(dogs);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// TODO: GET /acenters/:id/pets/:petId - Get pet from adoption center by id

// TODO: PUT /acenters/:id/pets/:petId - Update pet for adoption center

// TODO: DELETE /acenters/:id/pets/:petId - Delete pet for adoption center

export default router;
