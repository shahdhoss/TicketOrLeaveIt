const vendor = require("../models/vendor")
const {vendorPOST, vendorIdPATCH, vendorIdGET, vendorIdDELETE} = require("../services/DefaultService")
const express = require("express")
const router = express.Router()

router.post("/", (req,res)=>{
    const vendors= req.body
    if(!vendors){
        return res.status(400).json({error:"vendor is required"})
    }
    vendorPOST(vendor["body"]).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
})

router.patch("/:id", (req,res)=>{
    const id = req.params.id
    if(!id){
        return res.status(400).json({error: "vendor id is needed"})
    }
    vendorIdPATCH(id).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
})

router.delete("/:id", (req,res)=>{
    const vendorId = req.params.id
    if(!vendorId){
        return res.status(400).json({error: "vendor id is needed"})
    }
    vendorIdDELETE(vendorId).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
})

router.get("/:id", (req,res)=>{
    const vendorId = req.params.id
    if(!vendorId){
        return res.status(400).json({error: "Vendor id is needed"})
    }
    vendorIdGET(vendorId).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
})
module.exports = router