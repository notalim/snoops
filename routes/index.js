import acenterRoutes from "./acenters.js";
import userRoutes from "./users.js";
import extRoutes from "./ext.js";
import chatRoutes from "./chats.js";
import path from "path";

const constructorMethod = (app) => {
    app.get("/", (req, res) => {
        res.render("index");
    });
    app.use("/acenters", acenterRoutes);
    app.use("/users", userRoutes);
    app.use("/chats", chatRoutes);

    app.get("/about", (req, res) => {
        res.sendFile(path.resolve("static/about.html"));
    });

    app.use("*", (req, res) => {
        res.redirect("/public/404.html");
    });
};

export default constructorMethod;
