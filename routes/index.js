import acenterRoutes from "./acenters.js";
import userRoutes from "./users.js";
import mainAcenterRoutes from "./main-acenters.js";
import mainUserRoutes from "./main-users.js";
import mainRoutes from "./main.js";

const constructorMethod = (app) => {
    app.use("/acenters", acenterRoutes);
    app.use("/users", mainUserRoutes);
    app.use("/users", userRoutes);
    app.use("/acenters", mainAcenterRoutes);
    
    app.use("/", mainRoutes);

    app.use("*", (req, res) => {
        res.status(404).render("404Page");
    });
};

export default constructorMethod;
