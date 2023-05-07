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
        return res.render("index");
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
});

// // theme toggle
// router.post("/theme", (req, res) => {
//     console.log("POST /theme", req.body);
//     req.session.theme = req.body.theme;
//     res.sendStatus(200);
//     return;
// });

router.get("/resources", function (req, res) {
    return res.render("resources");
});

router.get("/about", async (req, res) => {
    return res.render("about");
});

export default router;
