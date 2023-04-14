import acenterRoutes from "./acenters.js";
import userRoutes from "./users.js";
import mainRoutes from "./main.js";
import chatRoutes from "./chats.js";
import path from "path";

const constructorMethod = (app) => {
    app.get("/", (req, res) => {
        res.render("index");
    });

    app.get("/users/signup", (req, res) => {
        res.render("signup", { userType: "user" });
    });

    app.get("/acenters/signup", (req, res) => {
        res.render("ac_signup", { userType: "adoption-center" });
    });

    app.get("/users/login", (req, res) => {
        res.render("login");
    });

    app.use("/", mainRoutes);
    app.use("/acenters", acenterRoutes);
    app.use("/users", userRoutes);
    app.use("/chats", chatRoutes);

    app.get("/about", (req, res) => {
        res.sendFile(path.resolve("static/about.html"));
    });

    app.use("*", (req, res) => {
        res.status(404).render("404Page");
    });
};

export default constructorMethod;
