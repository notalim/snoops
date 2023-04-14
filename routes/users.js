import { Router } from "express";
const router = Router();
import { acenterData, userData } from "../data/index.js";
import * as validation from "../validation.js";

// TODO: User Routes

// TODO: GET /users - Get all users

router.route("/").get(async (req, res) => {
    try {
        const users = await userData.getAllUsers();
        return res.status(200).json(users);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// TODO: GET /users/:id - Get user by id

router.route("/:id").get(async (req, res) => {
    // Validate the id
    let id = req.params.id;
    id = validation.checkId(id, "ID");

    try {
        const user = await userData.getUser(req.params.id);
        return res.status(200).json(user);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// TODO: POST /users - Create user

router.route("/signup").post(async (req, res) => {
    // Decompose request body

    let { email, password, firstName, lastName, dob, phone, address } =
        req.body;

    // Validate request body

    email = validation.checkEmail(email, "Email");

    firstName = validation.checkName(firstName, "First Name");

    lastName = validation.checkName(lastName, "Last Name");

    dob = validation.checkDate(dob, "Date of Birth");

    phone = validation.checkPhone(phone, "Phone Number");

    address = validation.checkString(address, "Address");

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
        res.redirect("/scroller");
    } catch (error) {
        res.render("signup", { error: error.toString() });
    }
});

// TODO: DELETE /users/:id - Delete user by id

router.route("/:id").delete(async (req, res) => {
    // Validate the id
    let id = req.params.id;
    id = validation.checkId(id, "ID");

    try {
        const user = await userData.deleteUser(req.params.id);
        return res.status(200).json(user);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// TODO: PUT /users/:id - Update user by id

router.route("/:id").put(async (req, res) => {
    // Validate the id
    let id = req.params.id;
    id = validation.checkId(id, "ID");

    // Decompose request body

    let { email, password, firstName, lastName, dob, phone, address } =
        req.body;

    // Validate request body

    email = validation.checkEmail(email, "Email");

    firstName = validation.checkName(firstName, "First Name");

    lastName = validation.checkName(lastName, "Last Name");

    dob = validation.checkDate(dob, "Date of birth");

    phone = validation.checkPhone(phone, "Phone Number");

    address = validation.checkString(address, "Address");

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
        res.status(500).json({ error: e });
    }
});

// TODO: Log In User

router.route("/login").post(async (req, res) => {
    // Decompose request body

    let { email, password } = req.body;

    try {
        email = validation.checkEmail(email, "Email");

        const user = await userData.loginUser(email, password); // Pass the plain password, not hashedPassword
        req.session.userId = user._id; // Store the userId, not the whole user object
        res.redirect("/scroller");
    } catch (e) {
        res.render("login", { error: e.toString() });
    }
});

export default router;
