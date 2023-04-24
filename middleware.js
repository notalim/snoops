export const userMiddleware = (protectedUserRoutes) => {
    return (req, res, next) => {
        const isLoggedIn = req.session.user;
        const fullPath = req.baseUrl + req.path;

        if (protectedUserRoutes.some(route => fullPath === "/users" + route) && !isLoggedIn) {
            res.redirect("/users/login-page");
            return;
        }
        next();
    };
};

export const acenterMiddleware = (protectedAcenterRoutes) => {
    return (req, res, next) => {
        const isLoggedIn = req.session.acenter;
        const fullPath = req.baseUrl + req.path;

        if (protectedAcenterRoutes.some(route => fullPath === "/acenters" + route) && !isLoggedIn) {
            res.redirect("/acenters/login-page");
            return;
        }
        next();
    };
};

export const redirectToScrollerIfLoggedIn = () => {
    return (req, res, next) => {
        console.log("req.session: ", req.session);
        
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
