const amqp = require("amqplib")
const { router } = require("../../../payment-service/app")

async function sendReservationToTickets(message){
    const exchange = "payForTicket"
    const routingKey = "events->payment"
    const con = await amqp.connect("amqp://localhost")
    const channel = await con.createChannel()
    await channel.assertExchange(exchange, "direct" ,{durable:true})
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)))
    console.log("sending to the payment service, success!!")
    setTimeout(()=> con.close(), 5000)
}

module.exports = sendReservationToTickets