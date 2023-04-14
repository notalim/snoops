import express from "express";
import configRoutes from "./routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import exphbs from "express-handlebars";
import expressSession from "express-session";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    expressSession({
        secret: "your_secret_key",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // Set to true for HTTPS connections
    })
);

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});

