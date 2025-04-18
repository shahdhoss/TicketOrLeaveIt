/* eslint-disable no-unused-vars */
const {events} = require('../models');
const Service = require('./Service');
const vendorClient = require("../grpcClient");
const withBreaker = require("../circuit-breaker/breaker")
const redisclient = require("../redisClient")
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
      console.log(event.body)
      const { organizer_id, vendor_name, type, facility, address, description, date, city, capacity, ticket_types} = event.body;
      console.log("vendor_name: ", vendor_name)
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
      resolve(Service.successResponse({
        event: eventData,
      }));
    } catch (e) {
      console.log(e)
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);


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
};
