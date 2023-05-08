import acenterRoutes from "./acenters.js";
import userRoutes from "./users.js";
import mainAcenterRoutes from "./main-acenters.js";
import mainUserRoutes from "./main-users.js";
import mainRoutes from "./main.js";
import chatRoutes from "./chats.js"

const constructorMethod = (app) => {
    app.use("/acenters", mainAcenterRoutes);
    app.use("/acenters", acenterRoutes);

    app.use("/users", mainUserRoutes);
    app.use("/users", userRoutes);

    app.use("/chats", chatRoutes);

    app.use("/", mainRoutes);

    app.use("*", (req, res) => {
        return res.status(404).render("404Page", {title: "404 Page", error: "Page not found."});
    });
};

export default constructorMethod;
