import { Router } from "express";
const router = Router();
import { acenterData, userData, extData } from "../data/index.js";

import * as validation from "../validation.js";

// *: Extension Routes to users and adoption centers

// *: Tinder Scroller (Default user page redirect)

router.get("/scroller/:id", async (req, res) => {
    try {
        const userId = req.session.user._id;
        const requestedUserId = req.params.id;

        //console.log(userId, requestedUserId);

        if (!userId) {
            return res.redirect("/users/login");
        }

        if (userId !== requestedUserId) {
            // Redirect to login page or show an error message
            return res.status(403).json({ error: "You are not authorized to access this page." });
        }

        const { dogs } = await userData.getUnseenDogs(userId);
        return res.render("scroller", { dogs: JSON.stringify(dogs) });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
});

// *: Log Out User

router.get("/logout", async (req, res) => {
    req.session.destroy();
    res.redirect("/");
    return;
});

// *: User Settings Page

router.get("/settings/:id", async (req, res) => {
    try {
        const userId = req.session.user._id;
        const requestedUserId = req.params.id;
        if (!userId) {
            return res.redirect("/users/login-page");
        }
        if (userId !== requestedUserId) {
            // Redirect to login page or show an error message
            return res.status(403).json({
                error: "You are not authorized to access this page.",
            });
        }
        const user = req.session.user;
        res.render("settings", { user });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

export default router;
