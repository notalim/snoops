import { Router } from "express";
const router = Router();
import { acenterData, userData } from "../data/index.js";
import * as validation from "../validation.js";
import { redirectToScrollerIfLoggedIn } from "../middleware.js";
import xss from "xss";
import multer from "multer";
import {v2 as cloudinary} from 'cloudinary';

// *: Log In Page

router.route("/login-page").get(redirectToScrollerIfLoggedIn(), (req, res) => {
    return res.render("user-login", {title: "User Log In"});
});

// *: Log In User

router.route("/login").post(async (req, res) => {
    // Decompose request body
    let email = xss(req.body.email);
    let password = xss(req.body.password);
    let savedEmail;

    // console.log("got email and password: ", email, password);

    try {
        email = validation.checkEmail(email, "Email");
        savedEmail = email;
    } catch (e) {
        return res.status(400).render("user-login", {
            error: e.toString(),
            title: "Log In",
            email: savedEmail,
        });
    }

    try {
        const user = await userData.loginUser(email, password);
        req.session.user = user;
        // console.log(user);
        return res.redirect(`/users/scroller/${user._id}`);
    } catch (e) {
        res.render("user-login", { error: e.toString(), title: "User Login", email: savedEmail });
        //console.log(e);
        return;
    }
});

// *: Sign Up Page

router.route("/signup-page").get(redirectToScrollerIfLoggedIn(), (req, res) => {
    return res.render("user-signup", {title: "User Signup"});
});

// *: Sign Up user (POST: Create user)

router.route("/signup").post(async (req, res) => {
    // check if the user's already logged in
    if (req.session.user) {
        return res.redirect(`/users/scroller/${user._id}`);
    }
    // Decompose request body

    let email = xss(req.body.email);
    let password = xss(req.body.password);
    let firstName = xss(req.body.firstName);
    let lastName = xss(req.body.lastName);
    let dob = xss(req.body.dob);
    let phone = xss(req.body.phone);
    let address = xss(req.body.address);

    let savedEmail,
        savedFirstName,
        savedLastName,
        savedDob,
        savedPhone,
        savedAddress;
    try {
        // Validate request body

        email = validation.checkEmail(email, "Email");
        savedEmail = email;

        firstName = validation.checkName(firstName, "First Name");
        savedFirstName = firstName;

        lastName = validation.checkName(lastName, "Last Name");
        savedLastName = lastName;

        dob = validation.checkDate(dob, "User Date of Birth");
        //console.log(dob);
        savedDob = dob;

        phone = validation.checkPhone(phone, "Phone Number");
        savedPhone = phone;

        address = validation.checkString(address, "Address");
        savedAddress = address;
    } catch (e) {
        return res.status(400).render("user-signup", {
            error: e.toString(),
            title: "Sign Up",
            email: savedEmail,
            firstName: savedFirstName,
            lastName: savedLastName,
            dob: savedDob,
            phone: savedPhone,
            address: savedAddress,
        });
    }

    try {
        const user = await userData.createUser(
            email,
            password,
            firstName,
            lastName,
            dob,
            phone,
            address
        );
        // return res.status(200).json(user);
        req.session.user = user;
        return res.redirect(`/users/scroller/${user._id}`);
    } catch (error) {
        return res
            .status(500)
            .render("user-signup", { error: error.toString(), title: "Sign Up" });
    }
});

// *: Get all users (GET /users)

router.route("/").get(async (req, res) => {
    try {
        const users = await userData.getAllUsers();
        return res.status(200).json(users);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// *: Get user by id (GET /users/:id)

router.route("/:id").get(async (req, res) => {
    console.log("GET /users/:id triggered with URL:", req.originalUrl);

    let id = req.params.id;
    //console.log(id);
    try {
        // Validate the id
        id = validation.checkId(id, "ID", "GET /users/:id");
    } catch (e) {
        return res.status(400).json({ error: e });
    }

    try {
        const user = await userData.getUser(req.params.id);
        return res.status(200).render("user-info", {
            user: user,
            key: process.env.GOOGLE_MAP_API_KEY,
        });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// TODO: DELETE /users/:id - Delete user by id

router.route("/:id").delete(async (req, res) => {
    // Validate the id
    let id = req.params.id;

    try {
        id = validation.checkId(id, "ID", "DELETE /users/:id");
    } catch (e) {
        return res.status(400).json({ error: e });
    }

    try {
        const user = await userData.deleteUser(req.params.id);
        return res.status(200).json(user);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// TODO: PUT /users/:id - Update user by id

let cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
let api_key = process.env.CLOUDINARY_API_KEY;
let api_secret = process.env.CLOUDINARY_API_SECRET;
cloudinary.config({
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret,
    secure: true
});

let upload = multer({
    storage: multer.diskStorage({}),
});

router.put("/:id", upload.single('image'),async (req, res) => {
    // Validate the id
    let id = req.params.id;

    // Decompose request body
    // ? future reference: does this have to be in a try catch in case there aren't exactly 8 fields?

    let email = xss(req.body.email);
    let password = xss(req.body.password);
    let firstName = xss(req.body.firstName);
    let lastName = xss(req.body.lastName);
    let dob = xss(req.body.dob);
    let phone = xss(req.body.phone);
    let address = xss(req.body.address);
    let image = null;

    if (req.file && req.file.path){
        image = req.file.path;
    }
    let agePreference = xss(req.body.agePreference);
    let sizePreferenceMax = xss(req.body.sizePreferenceMax);
    let genderPreferenceM = xss(req.body.genderPreferenceM);
    let genderPreferenceF = xss(req.body.genderPreferenceF);

    if (email == undefined || email == "" || email == null) {
        email = xss(req.session.user.email);
    }
    if (firstName == undefined || firstName == "" || firstName == null) {
        firstName = xss(req.session.user.firstName);
    }
    if (lastName == undefined || lastName == "" || lastName == null) {
        lastName = xss(req.session.user.lastName);
    }
    if (dob == undefined || dob == "" || dob == null) {
        dob = xss(req.session.user.dob);
    }
    if (phone == undefined || phone == "" || phone == null) {
        phone = xss(req.session.user.phone);
    }
    if (address == undefined || address == "" || address == null) {
        address = xss(req.session.user.address);
    }
    if(agePreference == undefined || agePreference == "" || agePreference == null){
        agePreference = null;
    }
    if(sizePreferenceMax == undefined || sizePreferenceMax == "" || sizePreferenceMax == null){
        sizePreferenceMax = null;
    }

    if(genderPreferenceF == undefined || genderPreferenceF == "" || genderPreferenceF == null){
        genderPreferenceF = false;
    }
    if(genderPreferenceF != undefined && genderPreferenceF != false){
        genderPreferenceF = true;
    }

    if(genderPreferenceM == undefined || genderPreferenceM == "" || genderPreferenceM == null){
        genderPreferenceM = false;
    }
    if(genderPreferenceM != undefined && genderPreferenceM != false){
        genderPreferenceM = true;
    }


    // console.log('Email: ' + email, 'Password: ' + password, 'fName: ' +firstName, 'lName: ' + lastName, 'dob: ' + dob, 'phone: '+ phone, 'address: ' + address, 'agePreference: ' + agePreference, 'sizePreferenceMax: ' + sizePreferenceMax, "GenderPreferenceF: " + genderPreferenceF, "GenderPreferenceM: " + genderPreferenceM)

    try {
        id = validation.checkId(id, "ID", "PUT /users/:id");

        // Validate request body

        email = validation.checkEmail(email, "Email");

        firstName = validation.checkName(firstName, "First Name");

        lastName = validation.checkName(lastName, "Last Name");

        dob = validation.checkDate(dob, "User Date of Birth");

        phone = validation.checkPhone(phone, "Phone Number");

        address = validation.checkString(address, "Address");

        let user = req.session.user;
        if (!image){
            image = user.img;
        }
        else {
            let upload = await cloudinary.uploader.upload(image);
            image = upload.secure_url;
        }

        agePreference = validation.checkOptionalMaxPrefrence(agePreference, "Age Preference");

        sizePreferenceMax = validation.checkOptionalMaxPrefrence(sizePreferenceMax, "Size Preference");

        genderPreferenceF = validation.checkBoolean(genderPreferenceF, "Gender F Preference");

        genderPreferenceM = validation.checkBoolean(genderPreferenceM, "Gender M Preference");
        
    } catch (e) {
        return res.status(400).render("settings", {title: "Settings", error: e.toString(), user: req.session.user});
    }

    try {
        const user = await userData.updateUser(
            req.params.id,
            email,
            password,
            firstName,
            lastName,
            dob,
            phone,
            address,
            image,
            agePreference,
            sizePreferenceMax,
            genderPreferenceM,
            genderPreferenceF
        );

        req.session.user = user;
        return res.status(200).json({ message: "User updated successfully" });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// *: Like a dog

router.route("/:id/like/:acenterId/:dogId").post(async (req, res) => {
    // Validate the ids
    let id = xss(req.params.id);
    let dogId = xss(req.params.dogId);
    let acenterId = xss(req.params.acenterId);

    try {
        id = validation.checkId(id, "ID", "POST /users/:id/like/:dogId");
        dogId = validation.checkId(
            dogId,
            "Dog ID",
            "POST /users/:id/like/:dogId"
        );
        acenterId = validation.checkId(
            acenterId,
            "Animal Center ID",
            "POST /users/:id/like/:dogId"
        );
    } catch (e) {
        return res.status(400).json({ error: e });
    }

    try {
        const user = await userData.likeDog(id, acenterId, dogId);
        if(user.success){
            req.session.user = user.newUser;
            return res.status(200).json(user.success);
        }
        else{
            return res.status(403).json({error: 'Invalid Request'});
        }
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// *: Dislike a dog

router.route("/:id/dislike/:acenterId/:dogId").post(async (req, res) => {
    // Validate the ids
    let id = xss(req.params.id);
    let dogId = xss(req.params.dogId);
    let acenterId = xss(req.params.acenterId);

    try {
        id = validation.checkId(
            id, 
            "ID", 
            "POST /users/:id/dislike/:dogId"
        );

        dogId = validation.checkId(
            dogId,
            "Dog ID",
            "POST /users/:id/dislike/:dogId"
        );

        acenterId = validation.checkId(
            acenterId,
            "Animal Center ID",
            "POST /users/:id/dislike/:dogId"
        );

    } catch (e) {
        return res.status(400).json({ error: e });
    }

    try {
        const user = await userData.swipeLeft(id, acenterId, dogId);
        if(user.success){
            req.session.user = user.newUser;
            return res.status(200).json(user.success);
        }
        else{
            return res.status(403).json({error: 'Invalid Request'});
        }
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});


// *: Upload a profile picture

router.route("/:id/uploadimage").post(async (req, res) => {
    //print the file contents that were uploaded
    console.log(req.file);
});
export default router;
