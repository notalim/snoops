import { Router } from "express";
const router = Router();

router.get("/", async (req, res) => {
    try {
        const { userId, acenterId } = req.session;
        if (userId) {
            return res.redirect(`/users/scroller/${user._id}`);
        } else if (acenterId) {
            return res.redirect("/ac-dashboard");
        }
        return res.render("index", {title: "Snoops!"});
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
});

router.get("/resources", function (req, res) {
    return res.render("resources", {title: "Resources"});
});

router.get("/about", async (req, res) => {
    return res.render("about", {title: "About Snoops"});
});

export default router;
