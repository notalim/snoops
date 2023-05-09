export const userMiddleware = (protectedUserRoutes) => {
    return (req, res, next) => {
        const isLoggedIn = req.session.user;
        const fullPath = req.baseUrl + req.path;
        const isAcenterLoggedIn = req.session.acenter;

        // if (!req.xhr) {
        //     return res.redirect("/404Page");
        // }

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
        const isUserLoggedIn = req.session.user;
        // console.log("Full path:", fullPath);
        // console.log("Is acenter logged in:", isLoggedIn);

        if (
            req.url !== "/login" &&
            req.url !== "/signup" &&
            req.url !== "/login-page" &&
            req.url !== "/signup-page"
        ) {
            if (!req.session) {
                // console.log("No session found");
                return res.redirect("/acenters/login-page");
            }
            if (!req.session.acenter) {
                // console.log("No acenter found in session");
                return res.redirect("/acenters/login-page");
            }
        }

        if (
            protectedAcenterRoutes.some(
                (route) => fullPath === "/acenters" + route
            ) &&
            !isLoggedIn
        ) {
            // console.log("Protected route and not logged in");
            res.redirect("/acenters/login-page");
            return;
        }

        if (isUserLoggedIn) {
            // console.log("User is logged in");
            res.status(404).render("404Page", {
                title: "404 Page",
                error: "You are already logged in as a user.",
            });
            return;
        }
        // console.log("Continuing to next middleware");
        next();
    };
};


export const chatMiddleware = (protectedChatRoutes) => {
    return (req, res, next) => {
        //console.log(req.session, req.xhr);

        const isUserLoggedIn = req.session.user;
        const isAcenterLoggedIn = req.session.acenter;
        const fullPath = req.baseUrl + req.path;
        // console.log(`${isUserLoggedIn} ${isAcenterLoggedIn} ${fullPath}`);
        console.log(protectedChatRoutes.some(
            (route) => 
            console.log(route)
            //fullPath === "/chats" + route
        ))
        if(!isUserLoggedIn && !isAcenterLoggedIn){
            return res.redirect("/users/login-page");
        }
        // if (!isUserLoggedIn &&
        //     !isAcenterLoggedIn &&
        //     protectedChatRoutes.some(
        //         (route) => fullPath === "/chats" + route
        //     )
        // ) {
        //     return res.redirect("/404Page");
        // }
        if (
            protectedChatRoutes.some((route) => fullPath === "/chats" + route)
        ) {
            if (!req.xhr) {
                return res.redirect("/404Page");
            }
        }
        if (isUserLoggedIn) {
            if (req.path.split("/")[2] !== req.session.user._id) {
                return res.redirect("/404Page");
            }
        }
        if (isAcenterLoggedIn) {
            if (req.path.split("/")[2] !== req.session.acenter._id) {
                return res.redirect("/acenters/login-page");
            }
        }
        console.log("here");
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

export function requireAcenterLogin(req, res, next) {
    if (!req.session.acenter) {
        return res.redirect("/acenters/login-page");
    }
    next();
}

export function requireUserLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/users/login-page");
    }
    next();
}