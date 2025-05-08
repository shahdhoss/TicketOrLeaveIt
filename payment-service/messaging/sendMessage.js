const amqp = require ("amqplib")

async function sendReservationToTickets(message) {
    const exchange = "confirmTicket"
    const routingKey = "payment->tickets"
    const con = await amqp.connect("amqp://localhost")
    const channel = await con.createChannel()
    await channel.assertExchange(exchange, "direct", {durable:true})
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)))
    console.log("reservation info sent from payment to tickets")
    setTimeout(()=>con.close(), 5000) 
}
async function cancelReservation(message) {
    const topic = "reserveTicket"
    const exchangeKey = "cancel.reservation"
    const con = await amqp.connect("amqp://localhost")
    const channel = await con.createChannel()
    await channel.assertExchange(topic, exchangeKey, {durable:true})
    channel.publish(topic, exchangeKey, Buffer.from(JSON.stringify(message)))
    console.log("cancelling the reservation")
    setTimeout(()=> con.close(), 5000)
}
module.exports = sendReservationToTickets, cancelReservation