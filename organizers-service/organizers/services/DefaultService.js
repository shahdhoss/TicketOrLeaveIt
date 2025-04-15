/* eslint-disable no-unused-vars */
const Service = require('./Service');
const {organizers} = require("../models")
/**
* Modifies the info of an existing organizer
*
* id Integer ID of the organizer to modify
* organizersPostRequest OrganizersPostRequest 
* no response value expected for this operation
* */
const organizersIdPATCH = ( id, organizersPostRequest ) => new Promise(
  async (resolve, reject) => {
    try {
      console.log("logging: ", id.id, id.body )
      const organizerId= id.id
      const organizerData = id.body
      const update = await organizers.update(organizerData, {where: {id:organizerId}})
      if(update[0]!=1){
        reject(Service.rejectResponse("organizer not found","404"))
      }
      resolve(Service.successResponse({
        id,
        organizersPostRequest,
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
* Adds a new organizer
*
* organizersPostRequest OrganizersPostRequest 
* no response value expected for this operation
* */
const organizersPOST = (organizersPostRequest ) => new Promise(
  async (resolve, reject) => {
    try {
      const {organization_name, industry_type, primary_contact_name, email, password, username} = organizersPostRequest.body
      const organizerData = {organization_name, industry_type, primary_contact_name, email, password, username}
      const organizerCreated = await organizers.create(organizerData) 
      if(!organizerCreated){
        reject(Service.rejectResponse("Organization creation failed","500"))
      }
      resolve(Service.successResponse({
        organizersPostRequest,
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
* Deletes an organizer
*
* organizersPostRequest OrganizersPostRequest 
* no response value expected for this operation
* */
const organizersIdDelete = (id ) => new Promise(
  async (resolve, reject) => {
    try {
      const organizerId = id.id
      const deletedOrganizer = await organizers.destroy({where: {id: organizerId}})
      if(!deletedOrganizer){
        reject(Service.rejectResponse("Organization not found","404"))
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
* Gets an organizer
*
* organizersPostRequest OrganizersPostRequest 
* orgainzer data expected as a response
* */
const organizersIdGET = (id) => new Promise(
  async (resolve, reject) => {
    try {
      const organizerId = id.id
      const organizer = await organizers.findOne({where: {id: organizerId}})
      if(!organizer){
        reject(Service.rejectResponse("Organization not found","404"))
      }
      const {organization_name, industry_type, primary_contact_name, email, password, username} = organizer
      const organizerData = {organization_name, industry_type, primary_contact_name, email, password, username}
      resolve(Service.successResponse({
        organizer: organizerData,
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
  organizersIdPATCH,
  organizersPOST,
  organizersIdDelete,
  organizersIdGET
};
