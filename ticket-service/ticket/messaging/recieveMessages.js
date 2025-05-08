const amqp = require("amqplib")
const redisClient = require("../redisClient")

async function recievingConfirmationFromPayment(){
    const exchange = "confirmTicket"
    const bindingKey = "payment->tickets"
    const con = await amqp.connect("amqp://localhost")
    const channel = await con.createChannel()
    await channel.assertExchange(exchange, "direct", {durable: true})
    const q = await channel.assertQueue("tickets", { durable: true });
    await channel.bindQueue(q.queue, exchange , bindingKey )
    console.log("recieving up and running")
    channel.consume(q.queue, async (message)=>{
        const data = JSON.parse(message.content.toString())
        await redisClient.set(`reservation:${data.user_id}`, String(data.event_id), {EX:600})
        console.log("proof of work: ", data)
        channel.ack(message)
    })
}

module.exports = recievingConfirmationFromPayment 