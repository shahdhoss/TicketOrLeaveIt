const amqp = require("amqplib")
const {events} = require("../models")

async function recieveMessageFromPayment(){
    const exchange = "eventCapacity"
    const bindingKey = "payment->events"
    const con = await amqp.connect("amqp://localhost")
    const channel = await con.createChannel()
    await channel.assertExchange(exchange, "direct", {durable:true})
    const q = await channel.assertQueue("eventMessages",{durable:true})
    await channel.bindQueue(q.queue, exchange, bindingKey)
    console.log("receiving message from payment")
    channel.consume(q.queue, async(message)=>{
        const data = JSON.parse(message.content.toString())
        console.log("message says: ", data.message)
        updateCapacity(data)
        channel.ack(message)
    })
}
async function updateCapacity(message){
    try{
        if (message.message =="Decrement"){
            await events.decrement('capacity', { by: 1, where: { id: message.event_id } })
        }
        else if (message.message == "Increment"){
            await events.increment('capacity', { by: 1, where: { id: message.event_id } })

        }
    }catch(e){
        console.log(e)
    }
}
module.exports = recieveMessageFromPayment