const {
   ticketsPOST,
   ticketsIdGET,
   ticketsIdPATCH,
   ticketsIdDELETE,
   ticketsHealth
} = require('../services/DefaultService');

const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
   const ticket = req.body;
   if (!ticket) {
       return res.status(400).json({ error: "Ticket data is required" });
   }
   ticketsPOST(ticket["body"])
       .then((response) => res.json(response))
       .catch((error) => res.status(error.code || 500).json(error));
});


router.get('/:id', (req, res) => {
   const id = req.params;
   if (!id) {
       return res.status(400).json({ error: "Ticket ID is required" });
   }
   ticketsIdGET(id)
       .then((response) => res.json(response))
       .catch((error) => res.status(error.code || 500).json(error));
});

router.patch('/:id', (req, res) => {
   const id = req.params.id;
   const ticket = req.body;
   if (!id || !ticket) {
       return res.status(400).json({ error: "Ticket ID and update data are required" });
   }
   ticketsIdPATCH(id, ticket)
       .then((response) => res.json(response))
       .catch((error) => res.status(error.code || 500).json(error));
});


router.delete('/:id', (req, res) => {
   const id = req.params;
   if (!id) {
       return res.status(400).json({ error: "Ticket ID is required" });
   }
   ticketsIdDELETE(id)
       .then((response) => res.json(response))
       .catch((error) => res.status(error.code || 500).json(error));
});

router.get("/health" , (req,res)=>{
    ticketsHealth.then((response)=> res.json(response)).catch((error)=> res.status(404).json(error))
})

module.exports = router;
