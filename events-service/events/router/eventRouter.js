const { response } = require("../../../payment-service/app")
const { eventsHealth } = require("../controllers/DefaultController")
const {eventsPOST, eventsIdGET, eventsIdPATCH, eventsIdDELETE, eventsSearch, eventsReserve, eventsCancel} = require("../services/DefaultService")
const { extractUserFromToken } = require("../middleware/authMiddleware")
const express = require("express")
const router = express.Router()

// Public routes
router.get("/health", (req, res) => {
    eventsHealth().then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
});

// Protected routes
router.post("/", extractUserFromToken, (req, res) => {
    const events = req.body
    if(!events){
        return res.status(400).json({error:"Event data is required"})
    }
    eventsPOST(events["body"]).then((response)=> res.json(response)).catch((error) => res.status(error.code).json(error))
});

router.get("/:id", extractUserFromToken, (req, res) => {
    const id = req.params
    eventsIdGET(id).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
});

router.patch("/:id", extractUserFromToken, (req, res) => {
    const id = req.params
    const event = req.body
    eventsIdPATCH(id, event["body"]).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
});

router.delete("/:id", extractUserFromToken, (req, res) => {
    const id = req.params
    eventsIdDELETE(id).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
});

router.post("/search", extractUserFromToken, (req, res) => {
    const query = req.body
    eventsSearch(query["body"]).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
});

router.post("/reserve", extractUserFromToken, (req, res) => {
    const reservation = req.body
    eventsReserve(reservation).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
});

router.post("/cancel", extractUserFromToken, (req, res) => {
    const reservation = req.body
    eventsCancel(reservation).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
});

module.exports = router;