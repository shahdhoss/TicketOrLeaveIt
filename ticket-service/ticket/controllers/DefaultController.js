const Controller = require('./Controller');
const service = require('../services/DefaultService');

const ticketsPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.ticketsPOST);
};

const ticketsIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service.ticketsIdDELETE);
};

const ticketsIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.ticketsIdGET);
};

const ticketsIdPATCH = async (request, response) => {
  await Controller.handleRequest(request, response, service.ticketsIdPATCH);
};
const ticketsHealth = async (request, response)=>{
  await Controller.handleRequest(request, response, service.ticketsHealth)
}
module.exports = {
  ticketsIdDELETE,
  ticketsIdGET,
  ticketsIdPATCH,
  ticketsPOST,
  ticketsHealth
};
