import { Router } from "express";
const router = Router();
import { acenterData, userData } from "../data/index.js";

// TODO: Adoption Centers Routes

// TODO: GET /acenters - Get all adoption centers

router.route("/").get(async (req, res) => {
    // ? do we need to validate the request?
    try {
        const acenters = await acenterData.getAllAdoptionCenters();
        return res.status(200).json(acenters);
    } catch (error) {
        res.status(500).json({ error: e });
    }
});

// TODO: GET /acenters/:id - Get adoption center by id



// TODO: POST /acenters - Create adoption center
// TODO: PUT /acenters/:id - Update adoption center
// TODO: DELETE /acenters/:id - Delete adoption center
// TODO: GET /acenters/:id/pets - Get all pets from adoption center
// TODO: GET /acenters/:id/pets/:petId - Get pet from adoption center by id
// TODO: POST /acenters/:id/pets - Create pet for adoption center
// TODO: PUT /acenters/:id/pets/:petId - Update pet for adoption center
// TODO: DELETE /acenters/:id/pets/:petId - Delete pet for adoption center

export default router;

