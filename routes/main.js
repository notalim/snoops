import { Router } from "express";
const router = Router();
import { acenterData, userData, extData } from "../data/index.js";

import * as validation from "../validation.js";

// TODO: Extension Routes to users and adoption centers

// TODO: Tinder Scroller (Default user page redirect)

router.get("/scroller", async (req, res) => {
    try {
        const { userId } = req.session;
        if (!userId) {
            return res.redirect("/users/login");
        }
        const { dogs } = await userData.getUnseenDogs(userId);
        res.render("scroller", { dogs: JSON.stringify(dogs) });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// TODO: Acenter Dashboard page (Default acenter page redirect / profile)

router.get("/ac-dashboard", async (req, res) => {
    try {
        console.log(req.session);
        const { acenterId } = req.session;
        if (!acenterId) {
            return res.redirect("/acenters/login");
        }
        const acenterDataObj = await acenterData.getAdoptionCenter(acenterId);
        if (!acenterDataObj) {
            return res
                .status(500)
                .json({ error: `No acenter found with ID ${acenterId}` });
        }
        
        const dogs = await acenterData.getAllDogs(acenterId);
        res.render("ac-dashboard", { acenter: acenterDataObj, dogs });
    } catch (error) {
        res.status(500).json({
            error: `Error in GET /ac-dashboard: ${error.toString()}`,
        });
    }
});

// TODO: Log Out User

router.get("/logout", async (req, res) => {
    req.session.destroy();
    res.redirect("/");
    return;
});

router.get("/settings", async (req, res) => {
    try {
        const { userId } = req.session;
        if (!userId) {
            return res.redirect("/users/login");
        }
        const user = await userData.getUser(userId);
        res.render("settings", { user });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

export default router;
