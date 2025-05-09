const axios = require('axios');
const { sendTicketEmail } = require('./emailService');
const logger = require('../utils/logger');
const redis = require('redis');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.connect().catch(console.error);

async function getUserEmail(userId) {
  try {
    const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${userId}` 
      }
    });
    return response.data.user.email;
  } catch (error) {
    logger.error('Error fetching user email:', error);
    throw new Error('Failed to fetch user email');
  }
}

async function getTicketDetails(ticketId) {
  try {
    const response = await axios.get(`${process.env.TICKET_SERVICE_URL}/tickets/${ticketId}`);
    return response.data.ticketData;
  } catch (error) {
    logger.error('Error fetching ticket details:', error);
    throw new Error('Failed to fetch ticket details');
  }
}

async function handleTicketCreation(data) {
  try {
    const { user_id, event_id } = data;
    // Store ticket info in Redis for later use
    await redisClient.set(`ticket:${user_id}:${event_id}`, JSON.stringify({
      userId: user_id,
      eventId: event_id,
      createdAt: new Date().toISOString()
    }), { EX: 3600 }); // Store for 1 hour
  } catch (error) {
    logger.error('Error storing ticket info:', error);
    throw error;
  }
}

async function handlePaymentConfirmation(data) {
  try {
    const { user_id, event_id } = data;
    
    // Get stored ticket info
    const ticketInfo = await redisClient.get(`ticket:${user_id}:${event_id}`);
    if (!ticketInfo) {
      logger.error('No ticket info found for payment confirmation');
      return;
    }

    const ticket = JSON.parse(ticketInfo);
    
    // Get user email from Auth service
    const userEmail = await getUserEmail(user_id);
    
    // Get ticket details from Ticket service
    const ticketDetails = await getTicketDetails(ticket.eventId);
   
    const emailData = {
      ticketId: ticket.eventId,
      eventName: ticketDetails.event_name,
      paymentMethod: 'Paymob',
      amount: ticketDetails.price
    };
    

    await sendTicketEmail(userEmail, emailData);
    
  
    await redisClient.del(`ticket:${user_id}:${event_id}`);
    
    logger.info(`Successfully sent ticket confirmation email to ${userEmail}`);
  } catch (error) {
    logger.error('Error in payment confirmation handling:', error);
    throw error;
  }
}

module.exports = {
  handleTicketCreation,
  handlePaymentConfirmation
}; 