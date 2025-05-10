/* eslint-disable no-unused-vars */
const {events, reservations} = require('../models');
const Service = require('./Service');
const vendorClient = require("../grpcClient");
const withBreaker = require("../circuit-breaker/breaker")
const redisclient = require("../redisClient")
const { Client } = require('@elastic/elasticsearch');
const es_client = new Client({
  node: "http://localhost:9200",
  apiVersion: '8.x'
});
const {sendReservationToTickets, sendCancellationToPayment} = require("../messaging/sendMessage")
const isHealthy = require("../messaging/checkHealth")
const axios = require("axios")
const { v4: uuidv4 } = require('uuid');

/**
* Delete an event by id
*
* id Integer Deletes an event using event id
* no response value expected for this operation
* */
const eventsIdDELETE = ( id ) => new Promise(
  async (resolve, reject) => {
    try {
      const eventId = id.id
      const deletedEvent = await events.destroy({where:{id:eventId}})
      if(!deletedEvent){
        reject(Service.rejectResponse("event not found","404"))
      }
      resolve(Service.successResponse({
        id:eventId,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get an event by id
*
* id Integer ID of the event to retrieve
* returns Event
* */
const eventsIdGET = ( id ) => new Promise(
  async (resolve, reject) => {
    try {
      console.log("woooo")
      const eventId = id.id
      const cacheKey = `event:${eventId}`
      const cachedEvent = await redisclient.get(cacheKey);
      if (cachedEvent) {
        return resolve(Service.successResponse({
          event: JSON.parse(cachedEvent),
        }));
      }
      const event = await events.findOne({where:{id:eventId}})
      if(!event){
        reject(Service.rejectResponse("event not found", 404))
      }
      const { organizer_id, vendorId, type, facility, address, description, date, city, capacity, ticket_types } = event
      const eventData = { organizer_id, vendor_id: vendorId, type, facility, address, description, date, city, capacity, ticket_types }
      await redisclient.set(cacheKey, JSON.stringify(eventData), {EX: 600 });
      resolve(Service.successResponse({
        event: eventData,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Partially update an event
*
* id Integer ID of the event to update
* eventUpdate EventUpdate 
* no response value expected for this operation
* */
const eventsIdPATCH = (id) => new Promise(
  async (resolve, reject) => {
    try {
      const eventId = id.id
      const eventData = id.body
      const update = await events.update(eventData,{where:{id:eventId}})
      if(update[0]!=1){
        reject(Service.rejectResponse("event not found","404"))
      }
      resolve(Service.successResponse({
        eventUpdate:eventData,
        id:eventId
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Add a new event
*
* event Event 
* no response value expected for this operation
* */
const eventsPOST = (event) => new Promise(
  async (resolve, reject) => {
    try {
      console.log("so we do get to here")
      const { organizer_id, vendor_name, type, facility, address, description, date, city, capacity, ticket_types} = event.body;
      const vendorId = await new Promise((resolve, reject) => {
        vendorClient.GetVendorByName({name: vendor_name} , (err, vendorRes) => {
          if (err) {
            return reject(new Error(`Error finding vendor: ${err.message}`));
          }
          if (!vendorRes || !vendorRes.id) {
            return reject(new Error("Vendor not found"));
          }
          resolve(vendorRes.id);
        });
      });
      const eventData = { organizer_id, vendor_id: vendorId, type, facility, address, description, date, city, capacity, ticket_types };
      const eventCreated = await events.create(eventData);
      if (!eventCreated) {
        return reject(Service.rejectResponse("Event creation failed", 505));
      }
      try{
        await es_client.index({
          index:"events",
          id: eventCreated.id,
          body :{
            type: eventCreated.type,
            description: eventCreated.description,
            date: eventCreated.date,
            city: eventCreated.city,
            vendor: vendor_name,
          }
        })
        resolve(Service.successResponse({
          event: eventData,
        }));
      } catch(e){
        console.log(e)
        reject(Service.rejectResponse(
          e.message || 'Invalid input',
          e.status || 405,
        ));
      }
    } catch (e) {
      console.log(e)
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

const eventsSearch = (query) => new Promise(
  async (resolve, reject) => {
  try {
    console.log("here is the query: ", query);
    if (!query) {
      return reject(Service.rejectResponse("Query cannot be null or undefined", 400));
    }
    const { vendor, type, city, date } = query;
    if (!vendor && !type && !city && !date) {
      return reject(Service.rejectResponse("At least one search parameter is required", 400));
    }
    let should = []
    if(vendor){
      should.push({
        multi_match:{
          query: vendor,
          fields :["vendor", "description"]
        }
      })
    }
    if(type){
      should.push({
        multi_match:{
          query: type,
          fields: ["type", "description"]
        }
      })
    }
    if(city){
      should.push({
        multi_match:{
          query: city,
          fields: ["city", "description"]
        }
      })
    }
    if(date){
      should.push({
        multi_match:{
          query: date,
          fields:["date", "description"]
        }
      })
    }
    const searchQuery = {
      index: "events", 
      body:{
        query:{
          bool:{
            should,
            minimum_should_match:1
          }
        }
      }
    }
    console.log("before result")
    let result;
    try {
      result = await es_client.search(searchQuery);
    } catch (error) {
      console.error("Elasticsearch search error:", error);
      return reject(Service.rejectResponse("Error querying Elasticsearch", 500));
    }
    console.log("after result")
    if (!result) {
      return reject(Service.rejectResponse("Something went wrong", 500));
    }

    resolve(Service.successResponse({result: result.hits.hits.map(hit => hit._source)}));
  } catch (e) {
    reject(Service.rejectResponse(e.message || 'Invalid input', e.status || 405));
  }
});

const eventsReserve = (reservation) => new Promise(
  async (resolve, reject)=>{
    try{
      const tickets_queue = "tickets"
      const {user_id, event_id} = reservation.body
      const reservation_id = uuidv4()
      const resObject = {id: reservation_id ,user_id, event_id}
      const newReservation = await reservations.create(resObject)
      if(!newReservation){
        reject(Service.rejectResponse("Reservation isn't successful", 400))
      }
      const reservation_object = {reservation_id: reservation_id, user_id: user_id, event_id: event_id }
      if (isHealthy(tickets_queue)){
        sendReservationToTickets(reservation_object)
        resolve(Service.successResponse({reservation: reservation_object}))
      }
      reject(Service.rejectResponse("Payment queue is not healthy", 400))
    }catch(e){
      console.log(e)
      reject(Service.rejectResponse(e, e.status || 405))
    }
  }
)

const eventsCancel = (reservation) => new Promise(
  async (resolve, reject)=>{
    try{
      const cancellations_queue = "cancellations"
      const {user_id, event_id}= reservation.body
      const resObject = {user_id, event_id}
      const payment_health = axios.get("http://localhost:8081/api/payments/health")
      if(isHealthy(cancellations_queue) && (await payment_health).status ===200){
        const updateReservation = await reservations.update({status: "canceled"}, {where:{id: event_id}})
        if(!updateReservation){
          reject(Service.rejectResponse("Reservation isn't successful", 400))
        }
        sendCancellationToPayment(resObject)
        resolve(Service.successResponse({reservation: resObject}))
     }
    }catch(error){
      console.log(e)
      reject(Service.rejectResponse(e, e.status || 405))
    }
  }
)

const eventsHealth = () => new Promise(
  async(resolve,reject)=>{
    try{
      resolve(Service.successResponse({status:"ok"}))
    }catch(e){
      reject(Service.rejectResponse(e, e.status || 405))
    }
  }
)

module.exports = {
  eventsIdDELETE:(id)=>
    withBreaker(eventsIdDELETE)(id).catch((e) => Promise.reject(
      Service.rejectResponse(e.message || 'Invalid input', e.status || 405)
    )),
  eventsIdGET:(id)=>
    withBreaker(eventsIdGET)(id).catch((e) => Promise.reject(
      Service.rejectResponse(e.message || 'Invalid input', e.status || 405)
    )),
  eventsIdPATCH:(id)=>
    withBreaker(eventsIdPATCH)(id).catch((e) => Promise.reject(
      Service.rejectResponse(e.message || 'Invalid input', e.status || 405)
    )),
  eventsPOST:(event)=>
    withBreaker(eventsPOST)(event).catch((e) => Promise.reject(
      Service.rejectResponse(e.message || 'Invalid input', e.status || 405)
    )),
  eventsSearch: (query) =>
    withBreaker(eventsSearch)(query).catch((e) => Promise.reject(
      Service.rejectResponse(e.message || "Invalid input", e.status || 405)
    )),
  eventsReserve: (reservation) =>
    withBreaker(eventsReserve)(reservation).catch((e) => Promise.reject(
      Service.rejectResponse(e.message || "Invalid input", e.status || 405)
    )),
  eventsCancel: (reservation) =>
    withBreaker(eventsCancel)(reservation).catch((e) => Promise.reject(
      Service.rejectResponse(e.message || "Invalid input", e.status || 405)
    )),
  eventsHealth
};
