const {vendorPOST, vendorIdPATCH, vendorIdGET, vendorIdDELETE} = require("../services/DefaultService")
const { extractUserFromToken } = require("../middleware/authMiddleware")
const express = require("express")
const router = express.Router()

// Public routes
router.get("/health", (req, res) => {
    res.json({ status: 'ok' });
});

// Protected routes
router.post("/", extractUserFromToken, (req, res) => {
    const vendors = req.body
    if(!vendors){
        return res.status(400).json({error:"vendor is required"})
    }
    vendorPOST(vendors["body"]).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
});

router.get("/:id", extractUserFromToken, (req, res) => {
    const id = req.params
    vendorIdGET(id).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
});

router.patch("/:id", extractUserFromToken, (req, res) => {
    const id = req.params
    const vendor = req.body
    vendorIdPATCH(id, vendor["body"]).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
});

router.delete("/:id", extractUserFromToken, (req, res) => {
    const id = req.params
    vendorIdDELETE(id).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
});

module.exports = router;