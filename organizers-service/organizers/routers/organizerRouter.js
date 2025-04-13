const express = require("express")
const router = express.Router()
const {organizersPOST, organizersIdPATCH, organizersDelete, organizersIdGET}= require("../services/DefaultService")

router.post("/", (req,res)=>{
    const organizer = req.body
    if(!organizer){
        return res.status(400).json({error:"Organizer info  is required"})
    }
    organizersPOST(organizer["body"]).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
})

router.patch("/:id", (req,res)=>{
    const id = req.params.id
    if(!id){
        return res.status(400).json({error: "Organizer id is required"})
    }
    organizersIdPATCH(id).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
})

router.delete("/:id", (req,res)=>{
    const id = req.params
    if(!id){
        return res.status(400).json({error:"Organizer id is needed"})
    }
    organizersDelete(id).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
})

router.get("/:id", (req,res)=>{
    const id = req.params
    if(!id) {
        return res.status(400).json({error:"organizer id is required"})
    }
    organizersIdGET(id).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
})
module.exports = router