import { Router } from "express";
const router = Router();
import { acenterData } from "../data/index.js";

// *: Extension Algorithm Routes for Acenters

// *: Acenter Dashboard page (Default acenter page redirect / profile)

router.get("/ac-dashboard/:id", async (req, res) => {
    // console.log("GET /ac-dashboard/:id")
    if (!req.session.acenter) {
        return res.redirect("/acenters/login-page");
    }
    if (!req.params.id) {
        return res.redirect(`/ac-dashboard/${req.session.acenter._id}`);
    }
    // console.log(req.session.acenter);

    try {
        const acenterId = req.session.acenter._id;
        const requestedAcenterId = req.params.id;

        if (!acenterId) {
            return res.redirect("/acenters/login-page");
        }

        if (acenterId !== requestedAcenterId) {
            return res
                .status(403)
                .json({ error: "You are not authorized to view this page" });
        }

        const dogs = await acenterData.getAllDogs(acenterId);
        return res.render("ac-dashboard", {
            title: "Dashboard",
            acenter: req.session.acenter,
            dogs: dogs,
        });
    } catch (error) {
        return res.status(500).json({
            error: `Error in GET /ac-dashboard: ${error.toString()}`,
        });
    }
});

// *: Log Out Acenter

router.get("/logout", async (req, res) => {
    req.session.destroy();
    return res.redirect("/");
});

export default router;
