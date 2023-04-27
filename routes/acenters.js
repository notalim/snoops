import { Router } from "express";
const router = Router();
import { acenterData, userData } from "../data/index.js";
import * as validation from "../validation.js";
import xss from 'xss';

// *: Adoption center Log In Page

router.route("/login-page").get(async (req, res) => {
    if (req.session.acenterId) {
        return res.redirect("/acenters/ac-dashboard");
    }
    return res.render("ac-login");
});

// *: Adoption center Log In

router.route("/login").post(async (req, res) => {
    if (req.session.acenterId) {
        return res.redirect("/acenters/ac-dashboard");
    }
    let email = xss(req.body.email);
    let password = xss(req.body.password);

    try {
        email = validation.checkEmail(email, "Email");
    } catch (e) {
        return res.status(400).json({ error: e });
    }

    try {
        const acenter = await acenterData.logInAdoptionCenter(
            email,
            password
        );

        // console.log(acenter);
        req.session.acenter = acenter;
        return res.redirect(`/acenters/ac-dashboard/${acenter._id}`);
    } catch (e) {
        console.log(e);
        return res.render("ac-login", { error: e.toString(), email });
    }
});

router.get("/signup-page", (req, res) => {
    if (req.session.acenterId) {
        return res.redirect("/acenters/ac-dashboard");
    }
    return res.render("ac-signup");
});

// *: Sign up (Create) adoption center (POST /acenters)

router.route("/signup").post(async (req, res) => {
    // Decompose request body
    let email = xss(req.body.email);
    let name = xss(req.body.name);
    let password = xss(req.body.password);
    let contactFirstName = xss(req.body.contactFirstName);
    let contactLastName = xss(req.body.contactLastName);
    let phone = xss(req.body.phone);
    let address = xss(req.body.address);
    
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

// *: GET /acenters - Get all adoption centers

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
        return res.status(400).json({ error: e });
    }

    try {
        const acenter = await acenterData.getAdoptionCenter(req.params.id);
        
        return res.status(200).render("acenter-info", {acenter: acenter, key: process.env.GOOGLE_MAP_API_KEY});
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// TODO: PUT /acenters/:id - Update adoption center

router.route("/:id").put(async (req, res) => {
    // Validate the id
    let id = req.params.id;
    // Decompose request body

    let email = xss(req.body.email);
    let name = xss(req.body.name);
    let password = xss(req.body.password);
    let contactFirstName = xss(req.body.contactFirstName);
    let contactLastName = xss(req.body.contactLastName);
    let phone = xss(req.body.phone);
    let address = xss(req.body.address);
    
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
    let name = xss(req.body.name);
    let dob = xss(req.body.dob);
    let breeds = xss(req.body.breeds);
    let gender = xss(req.body.gender);
    let size = xss(req.body.size);
    
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
        id = validation.checkId(
            id,
            "Adoption center ID",
            "GET /:id/dogs/:dogId"
        );
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
    let name = xss(req.body.name);
    let dob = xss(req.body.dob);
    let breeds = xss(req.body.breeds);
    let gender = xss(req.body.gender);
    let size = xss(req.body.size);

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
        id = validation.checkId(
            id,
            "Adoption center ID",
            "DELETE /acenters/:id/dogs/:dogId"
        );
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
