// This file should set up the express server as shown in the lecture code
import * as validator from "./validation.js";
import express from "express";
const app = express();
import configRoutes from "./routes/index.js";
import meow from "password-hash"

app.use(express.json());

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});
