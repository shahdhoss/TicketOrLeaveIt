const amqp = require("amqplib")

async function sendReservationToTickets(message){
    const exchange = "reserveTicket"
    const routingKey = "events->tickets"
    const con = await amqp.connect(process.env.RABBITMQ_URL||"amqp://localhost")
    const channel = await con.createChannel()
    await channel.assertExchange(exchange, "direct" ,{durable:true})
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)))
    console.log("sending to the tickets service, success!!")
    setTimeout(()=> con.close(), 5000)
}
async function sendCancellationToPayment(message) {
    const exchange = "cancelReseravtion"
    const routingKey = "events->payment"
    const con = await amqp.connect(process.env.RABBITMQ_URL||"amqp://localhost")
    const channel = await con.createChannel()
    await channel.assertExchange(exchange, "direct" ,{durable:true})
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)))
    console.log("sending to the payment service, success!!")
    setTimeout(()=> con.close(), 5000)
}
async function sendEventInfoToNotifications(message) {
    const exchange = "eventInfo"
    const routingKey = "events->notifs"
    const con = await amqp.connect(process.env.RABBITMQ_URL||"amqp://localhost")
    const channel = await con.createChannel()
    await channel.assertExchange(exchange, "direct" ,{durable:true})
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)))
    console.log("sending to the notifs service, success!!")
    setTimeout(()=> con.close(), 5000)
}
module.exports = {sendReservationToTickets, sendCancellationToPayment, sendEventInfoToNotifications}