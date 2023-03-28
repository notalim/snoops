import acenterRoutes from "./acenters.js";
import userRoutes from "./users.js";
import chatRoutes from "./chats.js";
import path from "path";

const constructorMethod = (app) => {
    app.use("/acenters", acenterRoutes);
    app.use("/users", userRoutes);
    app.use("/chats", chatRoutes);

    app.get("/about", (req, res) => {
        res.sendFile(path.resolve("static/about.html"));
    });
    
    app.use("*", (req, res) => {
        res.redirect("/posts");
    });
};

export default constructorMethod;
