export const userMiddleware = (protectedUserRoutes) => {
    return (req, res, next) => {
        const isLoggedIn = req.session.user;
        const fullPath = req.baseUrl + req.path;
        const isAcenterLoggedIn = req.session.acenter;

        if (
            protectedUserRoutes.some(
                (route) => fullPath === "/users" + route
            ) &&
            !isLoggedIn
        ) {
            res.redirect("/users/login-page");
            return;
        }

        if (isAcenterLoggedIn) {
            res.status(404).render("404Page", {
                title: "404 Page",
                error: "You are already logged in as an adoption center.",
            });
            return;
        }
        next();
    };
};

export const acenterMiddleware = (protectedAcenterRoutes) => {
    return (req, res, next) => {
        const isLoggedIn = req.session.acenter;
        const fullPath = req.baseUrl + req.path;
        const isUserLoggedIn = req.session.user;

        if (
            protectedAcenterRoutes.some(
                (route) => fullPath === "/acenters" + route
            ) &&
            !isLoggedIn
        ) {
            res.redirect("/acenters/login-page");
            return;
        }

        if (isUserLoggedIn) {
            res.status(404).render("404Page", {
                title: "404 Page",
                error: "You are already logged in as a user.",
            });
            return;
        }
        next();
    };
};

export const redirectToScrollerIfLoggedIn = () => {
    return (req, res, next) => {
        // console.log("req.session: ", req.session);

        if (req.session.user) {
            return res.redirect(`/users/scroller/${req.session.user._id}`);
        }
        if (req.session.acenter) {
            res.redirect(`/acenters/ac-dashboard/${req.session.acenter._id}`);
            return;
        }
        next();
    };
};
