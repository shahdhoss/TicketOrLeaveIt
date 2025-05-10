/* eslint-disable no-unused-vars */
const Service = require('./Service');
const {vendors}= require("../models");
const withBreaker = require("../circuit_breaker/breaker")
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
      const vendorData= {name,genre,biography}
      const vendorCreated = await vendors.create(vendorData)
      resolve(Service.successResponse({
        vendor: vendorCreated,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || "unknown error",
        e.status,
      ));
    }
  },
);

//wrapping the functions in circuit breaker 

module.exports = {
  vendorIdDELETE: (id) =>
    withBreaker(vendorIdDELETE)(id).catch((e) => Promise.reject(
      Service.rejectResponse(e.message || 'Invalid input', e.status || 405)
    )),

  vendorIdGET: (id) =>
    withBreaker(vendorIdGET)(id).catch((e) => Promise.reject(
      Service.rejectResponse(e.message || 'Invalid input', e.status || 405)
    )),

  vendorIdPATCH: (id) =>
    withBreaker(vendorIdPATCH)(id).catch((e) => Promise.reject(
      Service.rejectResponse(e.message || 'Invalid input', e.status || 405)
    )),

  vendorPOST: (vendor) =>
    withBreaker(vendorPOST)(vendor).catch((e) => Promise.reject(
      Service.rejectResponse(e.message, e.status)
    )),
};
