import { Router } from "express";
const router = Router();
import { acenterData, userData } from "../data/index.js";
import * as validation from "../validation.js";

// TODO: Adoption Centers Routes

// TODO: Adoption center Sign Up Page

router.get("/ac-signup-page", (req, res) => {
    if (req.session.userId) {
        res.redirect("/acenters/login-page");
        return;
    }
    res.render("ac-signup");
    return;
});

// TODO: Adoption center Log In Page

router.route("/login-page").get(async (req, res) => {
    if (req.session.acenterId) {
        // ? Make it redirect to acenter page
        res.redirect("index");
        return;
    }
    res.render("ac-login");
    return;
});

// TODO: GET /acenters - Get all adoption centers

router.route("/").get(async (req, res) => {
    try {
        const acenters = await acenterData.getAllAdoptionCenters();
        return res.status(200).json(acenters);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// TODO: GET /acenters/:id - Get adoption center by id

router.route("/:id").get(async (req, res) => {
    // Validate the id
    let id = req.params.id;
    try {
        id = validation.checkId(id, "ID", "GET /acenters/:id");
    } catch (e) {
        res.status(400).json({ error: e });
    }

    try {
        const acenter = await acenterData.getAdoptionCenter(req.params.id);
        return res.status(200).json(acenter);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// TODO: POST /acenters - Create adoption center

router.route("/signup").post(async (req, res) => {
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
    try {
        email = validation.checkEmail(email, "Email");

        name = validation.checkString(name, "Name");

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
    } catch (e) {
        return res.status(400).json({ error: e });
    }
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
        return res.status(500).json({ error: e });
    }
});

// TODO: PUT /acenters/:id - Update adoption center

router.route("/:id").put(async (req, res) => {
    // Validate the id
    let id = req.params.id;
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
    try {
        id = validation.checkId(id, "ID", "PUT /acenters/:id");

        email = validation.checkEmail(email, "Email");

        name = validation.checkString(name, "Name");
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
    } catch (e) {
        return res.status(400).json({ error: e });
    }
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
        return res.status(500).json({ error: e });
    }
});

// TODO: DELETE /acenters/:id - Delete adoption center

router.route("/:id").delete(async (req, res) => {
    // Validate the id
    let id = req.params.id;
    try {
        id = validation.checkId(id, "ID", "DELETE /:id");
    } catch (e) {
        return res.status(400).json({ error: e });
    }
    try {
        const acenter = await acenterData.deleteAdoptionCenter(req.params.id);
        return res.status(200).json(acenter);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// TODO: POST /acenters/:id/dogs - Create dog for adoption center

router.route("/:id/dogs").post(async (req, res) => {
    let id = req.params.id;

    // Decompose request body
    let { name, dob, breeds, gender, size } = req.body;
    try {
        // Validate the id
        id = validation.checkId(id, "Adoption center ID", "POST /:id/dogs");

        // Validate request body
        name = validation.checkString(name, "Name");

        dob = validation.checkDate(dob, "Date of Birth");

        breeds = validation.checkStringArray(breeds, "Breeds");

        gender = validation.checkGender(gender, "Gender");

        size = validation.checkPetWeight(size, "Weight");
    } catch (e) {
        return res.status(400).json({ error: e });
    }
    try {
        const dog = await acenterData.createDog(
            id,
            name,
            dob,
            breeds,
            gender,
            size
        );
        return res.status(200).json(dog);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// TODO: GET /acenters/:id/dogs - Get all dogs from adoption center

router.route("/:id/dogs").get(async (req, res) => {
    // Validate the id
    let id = req.params.id;
    try {
        id = validation.checkId(id, "Adoption center ID", "GET /:id/dogs");
    } catch (e) {
        return res.status(400).json({ error: e });
    }
    try {
        const dogs = await acenterData.getAllDogs(id);
        return res.status(200).json(dogs);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// TODO: GET /acenters/:id/dogs/:dogId - Get dog from adoption center by id

router.route("/:id/dogs/:dogId").get(async (req, res) => {
    // Validate the id
    let id = req.params.id;

    let dogId = req.params.dogId;

    try {
        id = validation.checkId(id, "Adoption center ID", "GET /:id/dogs/:dogId");
        dogId = validation.checkId(dogId, "Dog ID");
    } catch (e) {
        return res.status(400).json({ error: e });
    }
    try {
        const dog = await acenterData.getDogFromAcenter(id, dogId);
        return res.status(200).json(dog);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// TODO: PUT /acenters/:id/dogs/:dogId - Update dog for adoption center

router.route("/:id/dogs/:dogId").put(async (req, res) => {
    // Validate the id
    let id = req.params.id;

    let dogId = req.params.dogId;

    // Decompose request body
    let { name, dob, breeds, gender, size } = req.body;
    try {
        // Validate the id
        id = validation.checkId(
            id,
            "Adoption center ID",
            "PUT /:id/dogs/:dogId"
        );
        // Validate the dog id
        dogId = validation.checkId(dogId, "Dog ID");
        // Validate request body
        name = validation.checkString(name, "Name");

        dob = validation.checkDate(dob, "Date of Birth");

        breeds = validation.checkStringArray(breeds, "Breeds");

        gender = validation.checkGender(gender, "Gender");

        size = validation.checkPetWeight(size, "Weight");
    } catch (e) {
        return res.status(400).json({ error: e });
    }
    try {
        const dog = await acenterData.updateDog(
            id,
            dogId,
            name,
            dob,
            breeds,
            gender,
            size
        );
        return res.status(200).json([dog, { message: "Dog updated" }]);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// TODO: DELETE /acenters/:id/dogs/:dogId - Delete dog for adoption center

router.route("/:id/dogs/:dogId").delete(async (req, res) => {
    // Validate the id
    let id = req.params.id;

    let dogId = req.params.dogId;
    try {
        id = validation.checkId(id, "Adoption center ID", "DELETE /acenters/:id/dogs/:dogId");
        dogId = validation.checkId(dogId, "Dog ID");
    } catch (e) {
        return res.status(400).json({ error: e });
    }
    try {
        const dog = await acenterData.deleteDog(id, dogId);
        return res.status(200).json(dog);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});



export default router;
