const {usersPOST, usersIdGET, usersIdPATCH, usersIdDELETE, usersProfilePicturePATCH} = require('../services/DefaultService');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const express = require('express');
const router = express.Router();

router.post('/', (req,res) =>{
    const users = req.body
    if(!users){
        return res.status(400).json({error:"User is required"})
    }
    usersPOST(users["body"]).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
})
router.get("/:id", (req,res)=>{
    const id = req.params
    if(!id){
        return res.status(400).json({error:"User id is required"})
    }
    usersIdGET(id).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
})

router.patch("/:id", (req,res)=>{
    const id = req.params.id
    const users = req.body
    if (!id || !users){
        return res.status(400).json({error: "User id and data is needed"})
    }
    usersIdPATCH(id,users).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
})
router.delete("/:id", (req,res)=>{
    const id= req.params
    if(!id){
        return res.status(400).json({error:"User id is needed"})
    }
    usersIdDELETE(id).then((response) => res.json(response)).catch((error) => res.status(error.code).json(error));
})

module.exports = router;