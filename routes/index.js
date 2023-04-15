import acenterRoutes from "./acenters.js";
import userRoutes from "./users.js";
import mainRoutes from "./main.js";
import chatRoutes from "./chats.js";
import path from "path";

const constructorMethod = (app) => {
    app.get("/", (req, res) => {
        res.render("index");
    });
    
    app.use("/acenters", acenterRoutes);
    app.use("/users", userRoutes);
    app.use("/chats", chatRoutes);
    app.use("/", mainRoutes);

    app.use("*", (req, res) => {
        res.status(404).render("404Page");
    });
};

export default constructorMethod;
