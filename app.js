import express from "express";
import configRoutes from "./routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import exphbs from "express-handlebars";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";
import multer from "multer";
import cookieParser from "cookie-parser";


import {
    userMiddleware,
    acenterMiddleware,
    chatMiddleware,
} from "./middleware.js";

// ? THIS IS FOR THE WEBSITE TO NOT CRASH WHEN THERE IS AN ERROR
process.on("unhandledRejection", (reason, promise) => {
    console.log("Unhandled Rejection at:", promise, "reason:", reason);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "./.env") });

const app = express();

const viewsDir = path.join(__dirname, "views");
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", viewsDir);

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const staticDir = express.static(__dirname + "/public");
app.use("/public", staticDir);
app.use(cookieParser());
app.use(
    session({
        name: "AwesomeWebApp",
        secret: "This is a secret.. shhh don't tell anyone",
        saveUninitialized: true,
        resave: false,
    })
);

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
    // console.log("Session object:", req.session);
    res.locals.theme = req.cookies.theme || "light";
    // console.log("Middleware theme:", res.locals.theme);
    next();
});

const protectedUserRoutes = ["/settings", "/scroller"];
const protectedAcenterRoutes = ["/ac-dashboard", "/ac-settings"];
const protectedChatRoutes = [`/chats/user/`, "/chats/acenter/"];

app.use("/users", userMiddleware(protectedUserRoutes));
app.use("/acenters", acenterMiddleware(protectedAcenterRoutes));
//app.use("/chats", chatMiddleware(protectedChatRoutes));

app.use("/chats/user/:uid", (req, res, next) => {
    if(!req.session){
        return res.redirect("/users/login-page");
    }
    if(!req.session.user){
        return res.redirect("/users/login-page");
    }
    if(req.session.user._id !== req.params.uid){
        return res.redirect("/404Page");
    }
    next();
});

app.use("/chats/user/:uid/:acid", (req, res, next) => {
    if(!req.xhr){
        return res.redirect("/404Page");
    }
    next();
});

app.use("/chats/acenter/:acid", (req, res, next) => {
    if(!req.session){
        return res.redirect("/acenters/login-page");
    }
    if(!req.session.acenter){
        return res.redirect("/acenters/login-page");
    }
    if(req.session.acenter._id !== req.params.acid){
        return res.redirect("/404Page");
    }
    next();
});

app.use("/chats/acenter/:acid/:uid", (req, res, next) => {
    if(!req.xhr){
        return res.redirect("/404Page");
    }
    next();
});

// app.use("/users", (req, res, next) => {
//     console.log(req.url)
//     if(req.url !== '/login-page' && req.url !== '/signup-page' && req.url !== '/login' && req.url !== '/signup'){
//         if(!req.session){
//             return res.redirect("/users/login-page");
//         }
//         if(!req.session.user){
//             return res.redirect("/users/login-page");
//         }
//     }
//     next();
// });

// app.use("/acenters", (req, res, next) => {
//     if(req.url !== '/login-page' && req.url !== '/signup-page' && req.url !== '/login' && req.url !== '/signup'){
//         if(!req.session){
//             return res.redirect("/acenters/login-page");
//         }
//         if(!req.session.acenter){
//             return res.redirect("/acenters/login-page");
//         }
//     }
//     next();
// });

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets/uploads/");
    },
});

let upload = multer({ storage: storage });

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});
