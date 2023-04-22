import { Router } from "express";
const router = Router();

router.get("/", async (req, res) => {
    try {
        const { userId, acenterId } = req.session;
        if (userId) {
            return res.redirect("/scroller");
        } else if (acenterId) {
            return res.redirect("/ac-dashboard");
        }
        return res.render("index");
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

export default router;
