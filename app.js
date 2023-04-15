import express from "express";
import configRoutes from "./routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import exphbs from "express-handlebars";
import session from "express-session";
import dotenv from "dotenv";

process.on("unhandledRejection", (reason, promise) => {
    console.log("Unhandled Rejection at:", promise, "reason:", reason);
    console.error(reason.stack); // Add this line to log the stack trace
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
        };
    }
    next();
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});
