const amqp = require("amqplib")

async function sendReservationToTickets(message){
    const exchange = "reserveTicket"
    const routingKey = "events->tickets"
    const con = await amqp.connect("amqp://localhost")
    const channel = await con.createChannel()
    await channel.assertExchange(exchange, "direct" ,{durable:true})
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)))
    console.log("sending to the payment service, success!!")
    setTimeout(()=> con.close(), 5000)
}

module.exports = sendReservationToTickets