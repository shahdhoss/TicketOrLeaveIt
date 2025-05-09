const amqp = require ("amqplib")

async function updateTicketReservation(message){
    const exchange = "ticketReservation"
    const routingKey = "payment->tickets"
    const con = await amqp.connect("amqp://localhost")
    const channel = await con.createChannel()
    await channel.assertExchange(exchange, "direct", {durable: true})
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)))
    console.log("from the payment to the tickets service ", message)
    setTimeout(()=> con.close(), 5000)
}

async function updateEventCapacity(message){
    const exchange = "eventCapacity"
    const routingKey = "payment->events"
    const con = await amqp.connect("amqp://localhost")
    const channel = await con.createChannel()
    await channel.assertExchange(exchange, "direct", {durable: true})
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)))
    console.log("from the payment to the events service, changing the capacity", message)
    setTimeout(()=> con.close(), 5000)
}

module.exports = {updateTicketReservation, updateEventCapacity}