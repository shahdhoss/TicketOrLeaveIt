/* eslint-disable no-unused-vars */
const Service = require('./Service');
const {users}= require("../models");
const withBreaker = require("../circuit_breaker/breaker");
const { use } = require('chai');
const logger = require('../utils/logger');
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
      logger.error('Error in usersIdDELETE:', e);
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
      const userId = id.id
      const user = await users.findOne({where:{id:userId}})
      if(!user){
        return reject(Service.rejectResponse("User not found", 404,));
      }
      const {first_name, last_name, email, profilePicture, oauth_provider, last_login} = user
      const userData = {first_name, last_name, email, profilePicture, oauth_provider, last_login}
      resolve(Service.successResponse({
        user:userData,
      }));
    } catch (e) {
      logger.error('Error in usersIdGET:', e);
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
      console.log(id)
      const userId = id.id
      const userData = id.body
      console.log(userData)
      // Remove sensitive fields from update
      delete userData.password;
      delete userData.oauth_provider;
      delete userData.oauth_id;
      const update = await users.update(userData, {where:{id:userId}})
      if(update[0]!=1){
        reject(Service.rejectResponse("user not found","404"))
      }
      resolve(Service.successResponse({
        user:userData,
      }));
    } catch (e) {
      logger.error('Error in usersIdPATCH:', e);
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Add a new user from OAuth data
*
* user User 
* no response value expected for this operation
* */
const usersPOST = ( user ) => new Promise(
  async (resolve, reject) => {
    try {
      const {first_name, last_name, email, oauth_provider, oauth_id} = user.body
      // Check if user already exists
      const existingUser = await users.findOne({ 
        where: { 
          email: email 
        } 
      });

      if (existingUser) {
        // Update last login
        await existingUser.update({ last_login: new Date() });
        return resolve(Service.successResponse({
          user: existingUser,
          message: 'User already exists, updated last login'
        }));
      }

      // Create new user
      const userData = {
        first_name,
        last_name,
        email,
        oauth_provider,
        oauth_id,
        last_login: new Date()
      };

      const userCreated = await users.create(userData)
      resolve(Service.successResponse({
        user:userCreated,
        message: 'User created successfully'
      }));
    } catch (e) {
      logger.error('Error in usersPOST:', e);
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);


module.exports = {
  usersPOST,
  usersIdDELETE:(id)=>
    withBreaker(usersIdDELETE)(id).catch((e)=> Promise.reject(
      Service.rejectResponse(e.message || "Invalid input", e.status|| 405)
    )),
  
  usersIdGET:(id)=>
    withBreaker(usersIdGET)(id).catch((e)=> Promise.reject(
      Service.rejectResponse(e.message || "invalid input", e.status ||405)
    )),
  usersIdPATCH:(id)=>
    withBreaker(usersIdPATCH)(id).catch((e)=> Promise.reject(
      Service.rejectResponse(e.message || "invalid input", e.status ||405)
    )),
  usersPOST:(user)=>
    withBreaker(usersPOST)(user).catch((e)=> Promise.reject(
      Service.rejectResponse(e.message || "invalid input", e.status ||405)
    )),
};
