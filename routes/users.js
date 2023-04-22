import { Router } from "express";
const router = Router();
import { acenterData, userData } from "../data/index.js";
import * as validation from "../validation.js";
import { redirectToScrollerIfLoggedIn } from "../middleware.js";

// *: Log In Page

router.route("/login-page").get(redirectToScrollerIfLoggedIn(), (req, res) => {
    res.render("user-login");
    return;
});

// *: Log In User

router.route("/login").post(async (req, res) => {
    // Decompose request body

    let { email, password } = req.body;

    // console.log("got email and password: ", email, password);

    try {
        email = validation.checkEmail(email, "Email");
    } catch (e) {
        return res.status(400).json({ error: e });
    }

    try {
        const user = await userData.loginUser(email, password);
        req.session.user = user;
        return res.redirect(`/users/scroller/${user._id}`);
    } catch (e) {
        res.render("user-login", { error: e.toString(), email });
        console.log(e);
        return;
    }
});

// *: Sign Up Page

router.route("/signup-page").get(redirectToScrollerIfLoggedIn(), (req, res) => {
    res.render("user-signup");
    return;
});

// *: Sign Up user (POST: Create user)

router.route("/signup").post(async (req, res) => {
    // check if the user's already logged in
    if (req.session.user) {
        return res.redirect(`/users/scroller/${user._id}`);
        return;
    }
    // Decompose request body

    let { email, password, firstName, lastName, dob, phone, address } =
        req.body;

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
        return res.status(500).render("signup", { error: error.toString() });
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
    let { email, password, firstName, lastName, dob, phone, address } =
        req.body;

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
        return res
            .status(200)
            .json([user, { message: "User updated successfully" }]);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

export default router;
