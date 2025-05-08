const amqp = require("amqplib")

async function sendReservationToPayments(message) {
    const exchange = "confirmTicket"
    const routingKey = "tickets->payment"
    const con = await amqp.connect("amqp://localhost")
    const channel = await con.createChannel()
    await channel.assertExchange(exchange, "direct", {durable:true})
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)))
    console.log("reservation info sent from payment to tickets")
    setTimeout(()=> con.close(), 5000) 
}

module.exports = sendReservationToPayments