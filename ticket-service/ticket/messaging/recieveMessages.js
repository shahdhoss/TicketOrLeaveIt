const amqp = require("amqplib")
const redisClient = require("../redisClient")
const {ticket} = require("../models")

async function recievingReservationFromEvents(){
    const exchange = "reserveTicket"
    const bindingKey = "events->tickets"
    const con = await amqp.connect("amqp://localhost")
    const channel = await con.createChannel()
    await channel.assertExchange(exchange, "direct", {durable: true})
    const q = await channel.assertQueue("tickets", { durable: true });
    await channel.bindQueue(q.queue, exchange , bindingKey )
    console.log("recieving up and running")
    channel.consume(q.queue, async (message)=>{
        const data = JSON.parse(message.content.toString())
        await redisClient.set(`reservation:${data.reservation_id}`, JSON.stringify({user_id: data.user_id, event_id:data.event_id}) , {EX:600})
        console.log("proof of work: ", data)
        channel.ack(message)
    })
}

async function recievingMessageFromPayment(){
    const exchange = "ticketReservation"
    const bindingKey = "payment->tickets"
    const con = await amqp.connect("amqp://localhost")
    const channel = await con.createChannel()
    await channel.assertExchange(exchange, "direct", {durable: true})
    const q = await channel.assertQueue("updatedTickets", { durable: true });
    await channel.bindQueue(q.queue, exchange , bindingKey )
    console.log("recieving up and running")
    channel.consume(q.queue, async (message)=>{
        const data = JSON.parse(message.content.toString())
        updateTicketStatus(data)
        console.log("proof of work: ", data)
        channel.ack(message)
    })
}

async function updateTicketStatus(message) {
    try {
      const [updatedRows] = await ticket.update(
        { status: message.message },
        { where: { id: message.ticket_id } }
      );
      if (updatedRows === 0) {
        console.warn('No ticket found for given user id.');
      }
    } catch (err) {
      console.error('Failed to update ticket status:', err);
    }
  }
  

module.exports = {recievingReservationFromEvents , recievingMessageFromPayment}