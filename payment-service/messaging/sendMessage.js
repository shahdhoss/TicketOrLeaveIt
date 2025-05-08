const amqp = require ("amqplib")

async function updateEventReservation(message){
    const exchange = "eventReservation"
    const routingKey = "payment->events"
    const con = await amqp.connect("amqp://localhost")
    const channel = await con.createChannel()
    await channel.assertExchange(exchange, "direct", {durable: true})
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)))
    console.log("from the payment to the events service ", message)
    setTimeout(()=> con.close(), 5000)
}

module.exports = updateEventReservation