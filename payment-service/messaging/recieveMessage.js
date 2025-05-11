const amqp = require("amqplib")
const redisClient = require("../redisClient")

async function recieveReservationRequestFromTickets() {
    const exchange = "confirmTicket"
    const bindingKey = "tickets->payment"
    const con = await amqp.connect(process.env.RABBITMQ_URL||"amqp://localhost")
    const channel = await con.createChannel()
    await channel.assertExchange(exchange, "direct", {durable: true})
    const q = await channel.assertQueue("payments", {durable: true})
    await channel.bindQueue(q.queue, exchange, bindingKey)
    console.log("recieving up and running")
    channel.consume(q.queue,async (message)=>{
        const data = JSON.parse(message.content.toString())
        console.log("proof of work: ", data)
        console.log('user_id:', data.user_id, 'event_id:', data.event_id);
        await redisClient.set(`reservation:${data.ticket_id}`,JSON.stringify({event_id: data.event_id, user_id: data.user_id, amount: data.amount, reservation_id: data.reservation_id}),
        { EX: 600 })
        channel.ack(message)
    })
} 

async function recieveCancellationRequestFromEvents() {
    const exchange = "cancelReseravtion"
    const bindingKey = "events->payment"
    const con = await amqp.connect(process.env.RABBITMQ_URL ||"amqp://localhost")
    const channel = await con.createChannel()
    await channel.assertExchange(exchange, "direct", {durable: true})
    const q = await channel.assertQueue("cancellations", {durable: true})
    await channel.bindQueue(q.queue, exchange, bindingKey)
    console.log("recieving up and running")
    channel.consume(q.queue,async (message)=>{
        const data = JSON.parse(message.content.toString())
        console.log("proof of work: ", data)
        console.log("recieveing cacnela-0k")
        console.log(result)
        channel.ack(message)
    })
}
module.exports = {recieveReservationRequestFromTickets, recieveCancellationRequestFromEvents}