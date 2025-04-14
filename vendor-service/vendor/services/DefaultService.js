/* eslint-disable no-unused-vars */
const Service = require('./Service');
const {vendors}= require("../models");
const { where } = require('sequelize');
/**
* Deletes an event for a vendor
*
* eventId Integer ID of the event
* vendorId Integer ID of the vendor to update
* no response value expected for this operation
* */
const vendorEventsEventIdVendorIdDELETE = ({ eventId, vendorId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        eventId,
        vendorId,
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
* Updates an events of a vendor
*
* eventId Integer ID of the event
* vendorId Integer ID of the vendor to update
* returns _vendor_events__id__get_200_response
* */
const vendorEventsEventIdVendorIdPATCH = ({ eventId, vendorId }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        eventId,
        vendorId,
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
* Gets all events of a vendor
*
* id Integer ID of the vendor to update
* returns _vendor_events__id__get_200_response
* */
const vendorEventsIdGET = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
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
* Registering the upcoming events for a vendor
*
* vendorEventsPostRequest VendorEventsPostRequest 
* no response value expected for this operation
* */
const vendorEventsPOST = ({ vendorEventsPostRequest }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        vendorEventsPostRequest,
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
* Delete a vendor by vendor id
*
* id Integer Deletes a vendor from the system using vendor id
* no response value expected for this operation
* */
const vendorIdDELETE = (id) => new Promise(
  async (resolve, reject) => {
    try {
      const vendorID = id.id
      const deletedVendor = await vendors.destroy({where:{id:vendorID}})
      if(!deletedVendor){
        reject(Service.rejectResponse("vendor not found","404"))
      }
      resolve(Service.successResponse({
        id,
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
* Get vendor's info
*
* id Integer ID of the vendor to update
* no response value expected for this operation
* */
const vendorIdGET = (id) => new Promise(
  async (resolve, reject) => {
    try {
      const vendorId = id.id
      const vendor = await vendors.findOne({where:{id:vendorId}})
      if(!vendor){
        reject(Service.rejectResponse("vendor not found","404"))
      }
      const {name,genre,biography} = vendor
      const vendorData = {name,genre,biography}
      resolve(Service.successResponse({
        vendor: vendorData
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
* Update vendor's info
*
* id Integer ID of the vendor to update
* vendorIdPatchRequest VendorIdPatchRequest 
* no response value expected for this operation
* */
const vendorIdPATCH = (id) => new Promise(
  async (resolve, reject) => {
    try {
      const vendorId = id.id
      const vendorData = id.body
      const update = await vendors.update(vendorData, {where:{id:vendorId}})
      if(update[0]!=1){
        reject(Service.rejectResponse("vendor not found","404"))
      }
      resolve(Service.successResponse({
        vendor: vendorData
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
* Create a new vendor
*
* vendorPostRequest VendorPostRequest 
* no response value expected for this operation
* */
const vendorPOST = (vendor) => new Promise(
  async (resolve, reject) => {
    try {
      const {name,genre,biography} = vendor.body
      const vendorData= {name, genre,biography}
      const vendorCreated = await vendors.create(vendorData)
      resolve(Service.successResponse({
        vendor: vendorCreated,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  vendorEventsEventIdVendorIdDELETE,
  vendorEventsEventIdVendorIdPATCH,
  vendorEventsIdGET,
  vendorEventsPOST,
  vendorIdDELETE,
  vendorIdGET,
  vendorIdPATCH,
  vendorPOST,
};
