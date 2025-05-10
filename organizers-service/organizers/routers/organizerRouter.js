const express = require("express")
const router = express.Router()
const {organizersPOST, organizersIdPATCH, organizersDelete, organizersIdGET} = require("../services/DefaultService")
const { extractUserFromToken } = require("../middleware/authMiddleware")

// Public routes
router.get("/health", (req, res) => {
    res.json({ status: 'ok' });
});

// Protected routes
router.post("/", extractUserFromToken, (req, res) => {
    const organizer = req.body
    if(!organizer){
        return res.status(400).json({error:"Organizer info is required"})
    }
    organizersPOST(organizer["body"]).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
});

router.get("/:id", extractUserFromToken, (req, res) => {
    const id = req.params
    organizersIdGET(id).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
});

router.patch("/:id", extractUserFromToken, (req, res) => {
    const id = req.params
    const organizer = req.body
    organizersIdPATCH(id, organizer["body"]).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
});

router.delete("/:id", extractUserFromToken, (req, res) => {
    const id = req.params
    organizersDelete(id).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
});

module.exports = router;