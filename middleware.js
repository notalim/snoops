export const userMiddleware = (protectedUserRoutes) => {
    return (req, res, next) => {
        const isLoggedIn = req.session.user;
        const fullPath = req.baseUrl + req.path;
        const isAcenterLoggedIn = req.session.acenter;

        if (
            req.url !== "/login-page" &&
            req.url !== "/signup-page" &&
            req.url !== "/login" &&
            req.url !== "/signup"
        ) {
            if (!req.session) {
                return res.redirect("/users/login-page");
            }
            if (!req.session.user) {
                return res.redirect("/users/login-page");
            }
        }

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
        // console.log(fullPath);
        const isUserLoggedIn = req.session.user;

        if (
            req.url !== "/login-page" &&
            req.url !== "/signup-page" &&
            req.url !== "/login" &&
            req.url !== "/signup"
        ) {
            if (!req.session) {
                return res.redirect("/acenters/login-page");
            }
            if (!req.session.acenter) {
                return res.redirect("/acenters/login-page");
            }
        }

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

export const chatMiddleware = (protectedChatRoutes) => {
    return (req, res, next) => {
        //console.log(req.session, req.xhr);

        const isUserLoggedIn = req.session.user;
        const isAcenterLoggedIn = req.session.acenter;
        const fullPath = req.baseUrl + req.path;

        if (
            protectedChatRoutes.some(
                (route) => fullPath === "/chats" + route
            ) &&
            !isUserLoggedIn &&
            !isAcenterLoggedIn
        ) {
            return res.redirect("/404Page");
        }

        if (
            protectedChatRoutes.some((route) => fullPath === "/chats" + route)
        ) {
            if (!req.xhr) {
                return res.redirect("/404Page");
            }
        }

        if (isUserLoggedIn) {
            if (req.path.split("/")[2] !== req.session.user._id) {
                // console.log("req.path.split('/')[2]: ", req.path.split("/")[2]);
                // console.log("req.session.user._id: ", req.session.user._id);
                return res.redirect("/users/login-page");
            }
        }

        if (isAcenterLoggedIn) {
            if (req.path.split("/")[2] !== req.session.acenter._id) {
                return res.redirect("/acenters/login-page");
            }
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
