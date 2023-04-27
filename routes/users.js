import { Router } from "express";
const router = Router();
import { acenterData, userData } from "../data/index.js";
import * as validation from "../validation.js";
import { redirectToScrollerIfLoggedIn } from "../middleware.js";
import xss from 'xss';

// *: Log In Page

router.route("/login-page").get(redirectToScrollerIfLoggedIn(), (req, res) => {
    return res.render("user-login");
});

// *: Log In User

router.route("/login").post(async (req, res) => {
    // Decompose request body
    let email = xss(req.body.email);
    let password = xss(req.body.password);

    // console.log("got email and password: ", email, password);

    try {
        email = validation.checkEmail(email, "Email");
    } catch (e) {
        return res.status(400).json({ error: e });
    }

    try {
        const user = await userData.loginUser(email, password);
        req.session.user = user;
        console.log(user);
        return res.redirect(`/users/scroller/${user._id}`);
    } catch (e) {
        res.render("user-login", { error: e.toString(), email });
        console.log(e);
        return;
    }
});

// *: Sign Up Page

router.route("/signup-page").get(redirectToScrollerIfLoggedIn(), (req, res) => {
    return res.render("user-signup");
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
   
    try {
        // Validate request body

        email = validation.checkEmail(email, "Email");

        firstName = validation.checkName(firstName, "First Name");

        lastName = validation.checkName(lastName, "Last Name");

        dob = validation.checkDate(dob, "User Date of Birth");

        phone = validation.checkPhone(phone, "Phone Number");

        address = validation.checkString(address, "Address");
    } catch (e) {
        return res.status(400).json({ error: e });
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
            .render("user-signup", { error: error.toString() });
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
    console.log(id);
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

router.route("/:id").put(async (req, res) => {
    // Validate the id
    let id = req.params.id;

    // Decompose request body
    //future reference: does this have to be in a try catch in case there aren't exactly 8 fields?

    let email = xss(req.body.email);
    let password = xss(req.body.password);
    let firstName = xss(req.body.firstName);
    let lastName = xss(req.body.lastName);
    let dob = xss(req.body.dob);
    let phone = xss(req.body.phone);
    let address = xss(req.body.address);
    
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
        console.log('Email: ' + email, 'Password: ' + password, 'fName: ' +firstName, 'lName: ' + lastName, 'dob: ' + dob, 'phone: '+ phone, 'address: ' + address)

    try {
        id = validation.checkId(id, "ID", "PUT /users/:id");

        // Validate request body

        email = validation.checkEmail(email, "Email");

        firstName = validation.checkName(firstName, "First Name");

        lastName = validation.checkName(lastName, "Last Name");

        dob = validation.checkDate(dob, "User Date of Birth");

        phone = validation.checkPhone(phone, "Phone Number");

        address = validation.checkString(address, "Address");
    } catch (e) {
        return res.status(400).json({ error: e });
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
            address
        );
        return res.status(200).json([user, { message: "User updated successfully" }]);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// *: Like a dog

router.route("/:id/like/:acenterId/:dogId").post(async (req, res) => {
    // Validate the ids
    let id = req.params.id;
    let dogId = req.params.dogId;
    let acenterId = req.params.acenterId;

    try {
        id = validation.checkId(id, "ID", "POST /users/:id/like/:dogId");
        dogId = validation.checkId(dogId, "Dog ID", "POST /users/:id/like/:dogId");
        acenterId = validation.checkId(acenterId, "Animal Center ID", "POST /users/:id/like/:dogId");
    } catch (e) {
        return res.status(400).json({ error: e });
    }

    try {
        const user = await userData.likeDog(id, acenterId, dogId);
        if(user.success){
        return res.status(200).json(user.success);
        }
        else{
            return res.status(403).json({error: 'Invalid Request'});
        }
    } catch (e) {

        return res.status(500).json({ error: e });
    }
});

export default router;
