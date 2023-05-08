import { Router } from "express";
const router = Router();
import { acenterData } from "../data/index.js";

import * as validation from "../validation.js";
import xss from "xss";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

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

// ?: GET /acenters - Get all adoption centers

router.route("/").get(async (req, res) => {
    try {
        const acenters = await acenterData.getAllAdoptionCenters();
        return res.status(200).json(acenters);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// ?: GET /acenters/:id - Get adoption center by id

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

// *: PUT /acenters/:id - Update adoption center

let cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
let api_key = process.env.CLOUDINARY_API_KEY;
let api_secret = process.env.CLOUDINARY_API_SECRET;
cloudinary.config({
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret,
    secure: true,
});

let upload = multer({
    storage: multer.diskStorage({}),
});

router.put("/:id", upload.single("image"), async (req, res) => {
    // Validate the id
    let id = req.params.id;
    // Decompose request body

    //ADD TRY CATCH MAYBE

    let email = xss(req.body.email);
    let name = xss(req.body.name);
    let password = xss(req.body.password);
    let contactFirstName = xss(req.body.contactFirstName);
    let contactLastName = xss(req.body.contactLastName);
    let phone = xss(req.body.phone);
    let address = xss(req.body.address);
    let image = null;

    if (req.file && req.file.path) {
        image = req.file.path;
    }

    if (email == undefined || email == "" || email == null) {
        email = xss(req.session.acenter.email);
    }
    if (name == undefined || name == "" || name == null) {
        name = xss(req.session.acenter.name);
    }
    if (
        contactFirstName == undefined ||
        contactFirstName == "" ||
        contactFirstName == null
    ) {
        contactFirstName = xss(req.session.acenter.contactFirstName);
    }
    if (
        contactLastName == undefined ||
        contactLastName == "" ||
        contactLastName == null
    ) {
        contactLastName = xss(req.session.acenter.contactLastName);
    }

    if (phone == undefined || phone == "" || phone == null) {
        phone = xss(req.session.acenter.phone);
    }
    if (address == undefined || address == "" || address == null) {
        address = xss(req.session.acenter.address);
    }

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

        let acenter = req.session.acenter;
        if (!image) {
            image = acenter.img;
        } else {
            let upload = await cloudinary.uploader.upload(image);
            image = upload.secure_url;
        }
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
            address,
            image
        );

        const dogs = await acenterData.getAllDogs(id);

        // update location of every dog in the adoption center
        // console.log("dogs: ", dogs);
        // console.log("acenter: ", acenter);
        // console.log("location: ", acenter.location);
        for (let dog of dogs) {
            await acenterData.updateDogLocation(
                acenter._id.toString(),
                dog._id.toString(),
                acenter.location
            );
        }

        req.session.acenter = acenter;
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
    let breed1 = req.body.breed1;
    let breed2 = req.body.breed2;
    let breed3 = req.body.breed3;
    let breeds = [];
    let gender = req.body.gender;
    let size = req.body.size;

    // xss check
    try {
        name = xss(name);
        dob = xss(dob);
        breed1 = xss(breed1);
        breed2 = xss(breed2);
        breed3 = xss(breed3);
        gender = xss(gender);
        size = xss(size);
    } catch (e) {
        console.log(e);
        //What tf does this do
        return res
            .status(400)
            .type("application/json")
            .send({ error: e.toString() });
    }

    try {
        // console.log("server validation!");
        // Validate the id
        id = validation.checkId(id, "Adoption center ID", "POST /:id/dogs");

        // Validate request body
        name = validation.checkName(name, "Name");

        // console.log("Received dob:", dob); 
        dob = validation.checkDate(dob, "Date of Birth", 0, 20);
        // console.log("Validated dob:", dob); 

        if (breed1) {
            breeds.push(breed1);
        }
        if (breed2) {
            breeds.push(breed2);
        }
        if (breed3) {
            breeds.push(breed3);
        }

        breeds = validation.checkStringArray(breeds, "Breeds");

        gender = validation.checkGender(gender, "Gender");

        size = validation.checkPetWeight(parseInt(size), "Weight");
    } catch (e) {
        console.log(e);
        return res
            .status(400)
            .type("application/json")
            .send({ error: e.toString() });
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
        const acenter = await acenterData.getAdoptionCenter(id);
        return res.render("ac-dashboard", { acenter, success: "Dog added!" });
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

router.put("/:id/dogs/:dogId", upload.single('image'),async (req, res) => {
    // Validate the id
    let id = req.params.id;

    let dogId = req.params.dogId;

    // Decompose request body
    let name = xss(req.body.name);
    let dob = xss(req.body.dob);
    let breed1 = xss(req.body.breed1);
    let breed2 = xss(req.body.breed2);
    let breed3 = xss(req.body.breed3);
    let gender = xss(req.body.gender);
    let size = xss(req.body.size);
    let adoptionStatus = xss(req.body.adoptionStatus);
    let breeds = [];

    let image = null;

    if (req.file && req.file.path) {
        image = req.file.path;
    }

    let oldDog = await acenterData.getDogFromAcenter(id,dogId);

    if (name == undefined || name == "" || name == null) {
        name = xss(oldDog.name);
    }
    if (dob == undefined || dob == "" || dob == null) {
        dob = xss(oldDog.dob);
    }
    if (breed1 == undefined ||breed1 == "" || breed1 == null) {
        if (oldDog.breeds.length > 0){
            breed1 = xss(oldDog.breeds[0]);
        } else{
            breed1 = '';
        }
    }

    if (breed2 == undefined ||breed2 == "" || breed2 == null) {
        if (oldDog.breeds.length > 1){
            breed2 = xss(oldDog.breeds[1]);
        } else{
            breed2 = '';
        }
    }

    if (breed3 == undefined ||breed3 == "" || breed3 == null) {
        if (oldDog.breeds.length > 2){
            breed3 = xss(oldDog.breeds[2]);
        } else{
            breed3 = '';
        }
    }

    if (gender == undefined || gender == "" || gender == null) {
        gender = xss(oldDog.gender);

    }

    if (size == undefined || size == "" || size == null) {
        size = xss(oldDog.size);
    }

    if (adoptionStatus == undefined || adoptionStatus == "" || adoptionStatus == null) {
        adoptionStatus = xss(oldDog.adoptionStatus);
    }

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

        if (breed1) {
            breeds.push(breed1);
        }
        if (breed2) {
            breeds.push(breed2);
        }
        if (breed3) {
            breeds.push(breed3);
        }

        breeds = validation.checkStringArray(breeds, "Breeds");

        gender = validation.checkGender(gender, "Gender");

        size = validation.checkPetWeight(size, "Weight");

        adoptionStatus = validation.checkString(adoptionStatus, 'Adoption Status');

        if (!image) {
            image = oldDog.img;
        } else {
            let upload = await cloudinary.uploader.upload(image);
            image = upload.secure_url;
        }

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
            size,
            adoptionStatus,
            image
        );
        
        const acenter = await acenterData.getAdoptionCenter(id);
        return res.render("ac-dashboard", { acenter, success: "Dog Updated!" });
    } catch (e) {
        const acenter = await acenterData.getAdoptionCenter(id);
        return res.render("ac-dashboard", { acenter, error: e });
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
