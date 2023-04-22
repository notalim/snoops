import { Router } from "express";
const router = Router();
import { acenterData } from "../data/index.js";

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

// TODO: Log Out Acenter

router.get("/logout", async (req, res) => {
    req.session.destroy();
    res.redirect("/");
    return;
});

export default router;
