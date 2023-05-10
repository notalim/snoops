import { Router } from "express";
const router = Router();
import { acenterData, userData } from "../data/index.js";
import * as helpers from "./helpers.js";
import * as validation from "../validation.js";

// *: Extension Algorithm Routes for Users

// *: Tinder Scroller (Default user page redirect)

router.get("/scroller/:id", async (req, res) => {
    try {
        const userId = req.session.user._id;
        const requestedUserId = req.params.id;

        if (!userId) {
            return res.redirect("/users/login");
        }

        if (userId !== requestedUserId) {
            // Redirect to login page or show an error message
            return res.status(403).render("404Page", {error: "You are not authorized to access this page."});
        }

        const user = await userData.getUser(userId);

        //console.log(userId, requestedUserId);

        const { dogs } = await userData.getUnseenDogs(userId);

        const dogsWithDistanceAndAge = dogs.map((dog) => {
            let distance = "Distance Unknown";
            if (user.location && dog.location) {
                // console.log(user.location);
                // console.log(dog.location);
                const distanceInKm = helpers.calculateDistance(
                    user.location.lat,
                    user.location.long,
                    dog.location.lat,
                    dog.location.long
                );
                // Convert the distance from kilometers to miles
                distance = (distanceInKm * 0.621371).toFixed(2) + " miles";
            }
            const dob = new Date(dog.dob);
            const age = helpers.calculateAge(dob);
            return {
                ...dog,
                distance,
                age,
            };
        });

        return res.render("scroller", {
            title: "Find a Dog!",
            dogs: JSON.stringify(dogsWithDistanceAndAge),
        });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
});

// *: User Settings Page

router.get("/settings/:id", async (req, res) => {
    if (!req.session.user) {
        return res.redirect("/users/login-page");
    }
    try {
        const userId = req.session.user._id;
        const requestedUserId = req.params.id;
        if (!userId) {
            return res.redirect("/users/login-page");
        }
        if (userId !== requestedUserId) {
            return res
                .status(403)
                .render("404Page", {
                    error: "You are not authorized to access this page.",
                });
        }
        const user = req.session.user;

        //refresh likedDogs to have actual dog objects every time they visit settings page
        //this will ensure that no matter what is changed we dont have redundancy in our database
        //and the user can see the updated dog information.
        if (user.likedDogs.length > 0) {
            const updatedLikedDogs = [];
            for (let i = 0; i < user.likedDogs.length; i++) {
                const dogExists = await acenterData.dogExists(
                    user.likedDogs[i].acenterId,
                    user.likedDogs[i]._id
                );
                if (dogExists) {
                    const dog = await acenterData.getDogFromAcenter(
                        user.likedDogs[i].acenterId,
                        user.likedDogs[i]._id
                    );
                    updatedLikedDogs.push(dog);
                }
            }
            user.likedDogs = updatedLikedDogs;
        }
        res.render("settings", {title: "Settings", user });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// *: Log Out User

router.get("/logout", async (req, res) => {
    req.session.destroy();
    res.redirect("/");
    return;
});

export default router;
