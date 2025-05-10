const amqp = require("amqplib")
const {events, reservations} = require("../models")
const payment = require("../../../payment-service/models/payment")
const ticket = require("../../../ticket-service/ticket/models/ticket")

async function recieveMessageFromPayment(){
    const exchange = "eventCapacity"
    const bindingKey = "payment->events"
    const con = await amqp.connect("amqp://localhost")
    const channel = await con.createChannel()
    await channel.assertExchange(exchange, "direct", {durable:true})
    const q = await channel.assertQueue("eventMessages",{durable:true})
    await channel.bindQueue(q.queue, exchange, bindingKey)
    console.log("receiving message from payment")
    channel.consume(q.queue, async(message)=>{
        const data = JSON.parse(message.content.toString())
        console.log(data)
        console.log("message says: ", data.message)
        updateCapacityandReservationStatus(data)
        channel.ack(message)
    })
}
async function updateCapacityandReservationStatus(message){
    try{
        if (message.message =="Decrement"){
            await events.decrement('capacity', { by: 1, where: { id: message.event_id } })
            await reservations.update({status: "accepted", payment_id:message.payment_id, ticket_id: message.ticket_id}, {where:{id: message.reservation_id}})
        }
        else if (message.message == "Increment"){
            await events.increment('capacity', { by: 1, where: { id: message.event_id } })

        }

    }catch(e){
        console.log(e)
    }
}
module.exports = recieveMessageFromPayment