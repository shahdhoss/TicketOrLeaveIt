const amqp = require("amqplib")
const redisClient = require("../redisClient")

async function recieveReservationRequestFromTickets() {
    const exchange = "confirmTicket"
    const bindingKey = "tickets->payment"
    const con = await amqp.connect("amqp://localhost")
    const channel = await con.createChannel()
    await channel.assertExchange(exchange, "direct", {durable: true})
    const q = await channel.assertQueue("payments", {durable: true})
    await channel.bindQueue(q.queue, exchange, bindingKey)
    console.log("recieving up and running")
    channel.consume(q.queue,async (message)=>{
        const data = JSON.parse(message.content.toString())
        console.log("proof of work: ", data)
        console.log('user_id:', data.user_id, 'event_id:', data.event_id);
        await redisClient.set(`reservation:${data.user_id}`, String(data.event_id), {EX:600})
        let result = await redisClient.get(`reservation:${String(data.user_id)}`)
        console.log(result)
        channel.ack(message)
    })
}

module.exports = recieveReservationRequestFromTickets