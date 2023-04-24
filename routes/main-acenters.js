import { Router } from "express";
const router = Router();
import { acenterData } from "../data/index.js";

// TODO: Acenter Dashboard page (Default acenter page redirect / profile)

router.get("/ac-dashboard/:id", async (req, res) => {
    try {
        const acenterId = req.session.acenter._id;
        const requestedAcenterId = req.params.id;

        if (!acenterId) {
            return res.redirect("/acenters/login");
        }

        if (acenterId !== requestedAcenterId) {
            return res
                .status(403)
                .json({ error: "You are not authorized to view this page" });
        }

        const dogs = await acenterData.getAllDogs(acenterId);
        return res.render("ac-dashboard", { acenter: req.session.acenter, dogs: dogs });
    } catch (error) {
        return res.status(500).json({
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
