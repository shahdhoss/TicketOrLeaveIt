const amqp = require("amqplib")

async function recieveMessageFromPayment(){
    const exchange = "eventReservation"
    const bindingKey = "payment->events"
    const con = await amqp.connect("amqp://localhost")
    const channel = await con.createChannel()
    await channel.assertExchange(exchange, "direct", {durable:true})
    const q = await channel.assertQueue("paymentMessages",{durable:true})
    await channel.bindQueue(q.queue, exchange, bindingKey)
    console.log("receiving message from payment")
    channel.consume(q.queue, async(message)=>{
        const data = JSON.parse(message.content.toString())
        console.log("message says: ", data.message)
        await redisClient.set(`response: ${data.user_id}`, String(data.message), {EX:600})
        channel.ack(message)
    })
}
module.exports = recieveMessageFromPayment