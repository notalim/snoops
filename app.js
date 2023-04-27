import express from "express";
import configRoutes from "./routes/index.js";
import userRoutes from "./routes/users.js";
import acenterRoutes from "./routes/acenters.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import exphbs from "express-handlebars";
import session from "express-session";
import dotenv from "dotenv";
import { userMiddleware, acenterMiddleware } from "./middleware.js";

// ? THIS IS FOR THE WEBSITE TO NOT CRASH WHEN THERE IS AN ERROR
process.on("unhandledRejection", (reason, promise) => {
    console.log("Unhandled Rejection at:", promise, "reason:", reason);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const app = express();

import path from "path";

const viewsDir = path.join(__dirname, "views");
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", viewsDir);

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        name: "AwesomeWebApp",
        secret: "This is a secret.. shhh don't tell anyone",
        saveUninitialized: true,
        resave: false,
    })
);

const protectedUserRoutes = ["/settings", "/scroller"];
const protectedAcenterRoutes = ["/ac-dashboard", "/ac-settings"];

app.use("/users", userMiddleware(protectedUserRoutes));
app.use("/acenters", acenterMiddleware(protectedAcenterRoutes));

app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = {
            _id: req.session.user._id,
            firstName: req.session.user.firstName,
            userType: "user",
        };
    } else if (req.session.acenter) {
        res.locals.acenter = {
            _id: req.session.acenter._id,
            name: req.session.acenter.name,
            userType: "acenter",
        };
    }
    next();
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});
