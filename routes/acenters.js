import { Router } from "express";
const router = Router();
import { acenterData, userData } from "../data/index.js";
import * as validation from "../validation.js";
import xss from "xss";

// *: Adoption center Log In Page

router.route("/login-page").get(async (req, res) => {
    if (req.session.acenterId) {
        return res.redirect("/acenters/ac-dashboard");
    }
    return res.render("ac-login", { title: "Adoption Center Login" });
});

// *: Adoption center Log In

router.route("/login").post(async (req, res) => {
    if (req.session.acenterId) {
        return res.redirect("/acenters/ac-dashboard");
    }

    let email = xss(req.body.email);
    let password = xss(req.body.password);
    let savedEmail;

    try {
        email = validation.checkEmail(email, "Email");
        savedEmail = email;
    } catch (e) {
        return res.render("ac-login", {
            title: "Adoption Center Login",
            error: e.toString(),
            email: savedEmail,
        });
    }

    try {
        const acenter = await acenterData.logInAdoptionCenter(email, password);

        // console.log(acenter);
        req.session.acenter = acenter;
        return res.redirect(`/acenters/ac-dashboard/${acenter._id}`);
    } catch (e) {
        console.log(e);
        return res.render("ac-login", {
            error: e.toString(),
            email: savedEmail,
        });
    }
});

router.get("/signup-page", (req, res) => {
    if (req.session.acenterId) {
        return res.redirect("/acenters/ac-dashboard");
    }
    return res.render("ac-signup", { title: "Adoption Center Signup" });
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

    let savedEmail,
        savedName,
        savedContactFirstName,
        savedContactLastName,
        savedPhone,
        savedAddress;

    // Validate request body
    try {
        email = validation.checkEmail(email, "Email");
        savedEmail = email;

        name = validation.checkString(name, "Name");
        savedName = name;

        contactFirstName = validation.checkName(
            contactFirstName,
            "Contact First Name"
        );
        savedContactFirstName = contactFirstName;

        contactLastName = validation.checkName(
            contactLastName,
            "Contact Last Name"
        );
        savedContactLastName = contactLastName;

        phone = validation.checkPhone(phone, "Phone");
        savedPhone = phone;

        address = validation.checkString(address, "Address");
        savedAddress = address;
    } catch (e) {
        return res.render("ac-signup", {
            error: e.toString(),
            title: "Adoption Center Signup",
            email: savedEmail,
            name: savedName,
            contactFirstName: savedContactFirstName,
            contactLastName: savedContactLastName,
            phone: savedPhone,
            address: savedAddress,
        });
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
        return res.redirect(`/acenters/ac-dashboard/${acenter._id}`);
    } catch (e) {
        return res.render("ac-signup", {
            error: e.toString(),
            title: "Adoption Center Signup",
            email: savedEmail,
            name: savedName,
            contactFirstName: savedContactFirstName,
            contactLastName: savedContactLastName,
            phone: savedPhone,
            address: savedAddress,
        });
    }
});

// *: GET /acenters - Get all adoption centers
// ?: Do we remove it?

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

        return res.status(200).render("acenter-info", {
            acenter: acenter,
            key: process.env.GOOGLE_MAP_API_KEY,
        });
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

// *: POST /acenters/:id/ - Create dog for adoption center

router.route("/ac-dashboard/:id/").post(async (req, res) => {
    //console.log("POST route called");
    let id = req.params.id;

    let name = req.body.name;
    let dob = req.body.dob;
    let breeds = req.body.breeds;
    let gender = xss(req.body.gender);
    let size = xss(req.body.size);

    // xss check
    try {
        name = xss(req.body.name);
        dob = xss(req.body.dob);
        breeds = xss(req.body.breeds);
        gender = xss(req.body.gender);
        size = xss(req.body.size);
    } catch (e) {
        console.log(e);
        res.status(400).type("application/json").send({ error: e.toString() });
    }

    try {
        // Validate the id
        id = validation.checkId(id, "Adoption center ID", "POST /:id/dogs");

        // Validate request body
        name = validation.checkString(name, "Name");

        dob = validation.checkDate(dob, "Date of Birth", 1, 20);

        breeds = JSON.parse(breeds);
        breeds = validation.checkStringArray(breeds, "Breeds");

        gender = validation.checkGender(gender, "Gender");

        size = validation.checkPetWeight(parseInt(size), "Weight");
    } catch (e) {
        console.log(e);
        res.status(400).type("application/json").send({ error: e.toString() });
    }

    try {
        // console.log('Creating dog');
        const dog = await acenterData.createDog(
            id,
            name,
            dob,
            breeds,
            gender,
            size
        );
        // console.log("Dog created");
        return res.redirect("/acenters/ac-dashboard/" + id);
    } catch (e) {
        console.log(e);
        const acenter = await acenterData.getAdoptionCenter(id);
        return res.render("ac-dashboard", { acenter, error: e });
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

// TODO: DELETE /acenters/ac-dashboard/:id/dogs/:dogId - Delete dog for adoption center

router.route("/ac-dashboard/:id/dogs/:dogId").delete(async (req, res) => {
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
