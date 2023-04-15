import express from "express";
import configRoutes from "./routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import exphbs from "express-handlebars";
import session from "express-session";
import dotenv from "dotenv";

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

app.use((req, res, next) => {
    if (req.session.userId) {
        res.locals.user = {
            _id: req.session.userId,
            firstName: req.session.userFirstName,
            userType: "user",
        };
    } else if (req.session.acenterId) {
        res.locals.user = {
            _id: req.session.acenterId,
            firstName: req.session.acenterName,
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
