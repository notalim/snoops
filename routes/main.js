import { Router } from "express";
const router = Router();
import { acenterData, userData, extData } from "../data/index.js";

import * as validation from "../validation.js";

// TODO: Extension Routes to users and adoption centers

// TODO: Get Unseen Dogs

router.get("/scroller", async (req, res) => {
    try {
        const { userId } = req.session;
        if (!userId) {
            return res.redirect("/users/login");
        }
        const { dogs } = await userData.getUnseenDogs(userId);
        res.render("scroller", { dogs });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});


// TODO: Log Out User

router.get("/logout", async (req, res) => {
    req.session.destroy();
    res.redirect("/");
    return;
});

router.get("/settings", async (req, res) => {
    try{
        const { userId } = req.session;
        if (!userId) {
            return res.redirect("/users/login");
        }
        const user = await userData.getUser(userId);
        res.render("settings", { user });
    } catch(error) {
        res.status(500).json({ error: error.toString() });
    }
})


export default router;
