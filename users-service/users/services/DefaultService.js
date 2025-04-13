/* eslint-disable no-unused-vars */
const Service = require('./Service');
const {users}= require("../models");
const { use } = require('chai');

/**
* Delete a user by id
*
* id Integer Deletes an user using user id
* no response value expected for this operation
* */
const usersIdDELETE = ( id ) => new Promise(
  async (resolve, reject) => {
    try {
      const userId = id.id
      const deletedUser = await users.destroy({where:{id:userId}})
      if (!deletedUser){
        reject(Service.rejectResponse("user not found","404"))
      }
      resolve(Service.successResponse({
        id
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
* Get a user by id
*
* id String 
* no response value expected for this operation
* */
const usersIdGET = ( id ) => new Promise(
  async (resolve, reject) => {
    try {
      const userid= id.id
      const user = await users.findOne({where:{id:userid}})
      if(!user){
        return reject(Service.rejectResponse("User not found", 404,));
      }
      const {first_name, last_name, email, profilePicture} = user
      const userData = {first_name, last_name, email, profilePicture}
      resolve(Service.successResponse({
        user:userData,
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
* Partially update user's info
*
* id Integer ID of the user to update
* user User 
* no response value expected for this operation
* */
const usersIdPATCH = ( id ) => new Promise(
  async (resolve, reject) => {
    try {
      const userId = id.id
      const userData = id.body.users
      const update = await users.update(userData, {where:{id:userId}})
      if(update[0]!=1){
        reject(Service.rejectResponse("user not found","404"))
      }
      resolve(Service.successResponse({
        user:userData,
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
* Add a new user
*
* user User 
* no response value expected for this operation
* */
const usersPOST = ( user ) => new Promise(
  async (resolve, reject) => {
    try {
      const {first_name, last_name, email,password} = user.body.users
      const userData = {first_name, last_name, email,password}
      const userCreated = await users.create(userData)
      resolve(Service.successResponse({
        user:userCreated,
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
  usersIdDELETE,
  usersIdGET,
  usersIdPATCH,
  usersPOST,
};
