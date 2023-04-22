export const middleware = (protectedUserRoutes, protectedAcenterRoutes) => {
    return (req, res, next) => {
        const isLoggedIn = req.session.userId || req.session.acenterId;
        const isUser = req.session.userId;
        const isAcenter = req.session.acenterId;

        if (protectedUserRoutes.includes(req.path) && !isLoggedIn) {
            res.redirect("/users/login-page");
            return;
        }

        if (protectedAcenterRoutes.includes(req.path) && !isLoggedIn) {
            res.redirect("/acenters/login-page");
            return;
        }

        if (isUser && protectedAcenterRoutes.includes(req.path)) {
            res.redirect("/users/scroller");
            return;
        }

        if (isAcenter && protectedUserRoutes.includes(req.path)) {
            res.redirect("/acenters/ac-dashboard");
            return;
        }

        if (req.path === "/scroller") {
            if (!isLoggedIn) {
                res.redirect("/login");
                return;
            }
        } else if (req.path === "/logout") {
            // req.session.destroy();
            if (!isLoggedIn) {
                res.redirect("/login");
                return;
            }
        }
        next();
    };
};

export const redirectToScrollerIfLoggedIn = () => {
    return (req, res, next) => {
        if (req.session.userId) {
            res.redirect("/scroller");
            return;
        }
        if (req.session.acenterId) {
            res.redirect("/ac-dashboard");
            return;
        }
        next();
    };
};
