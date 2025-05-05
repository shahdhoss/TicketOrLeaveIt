const {eventsPOST, eventsIdGET, eventsIdPATCH, eventsIdDELETE, eventsSearch} = require("../services/DefaultService")
const express = require("express")
const router = express.Router()

router.post("/", (req,res)=>{
    const events = req.body
    if(!events){
        return res.status(400).json({error:"User is required"})
    }
    eventsPOST(events["body"]).then((response)=> res.json(response)).catch((error) => res.status(error.code).json(error))
})

router.get("/:id", (req,res)=>{
    const id = req.params
    if(!id){
        return res.status(400).json({error:"event id is required"})
    }
    eventsIdGET(id).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
})
router.patch("/:id",(req,res)=>{
    const id = req.params.id
    if (!id){
        return res.status(400).json({error: "Event id and data is needed"})
    }
    eventsIdPATCH(id).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
})
router.delete("/:id", (req,res)=>{
    const id = req.params
    if(!id){
        return res.status(400).json({error:"Event id is needed"})
    }
    eventsIdDELETE(id).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
})
router.get("/search", (req,res)=>{
    const query = req.query
    if(!query){
        return res.status(400).json({error:"Query is needed"})
    }
    eventsSearch(query).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
})

module.exports = router;