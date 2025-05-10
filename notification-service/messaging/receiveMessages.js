const amqp = require('amqplib');
const redisClient = require("../redisClient");
const ticket = require('../../ticket-service/ticket/models/ticket');

async function recieveEventInfo() {
  const exchange = "eventInfo"
  const bindingKey = "events->notifs"
  const con = await amqp.connect("amqp://localhost")
  const channel = await con.createChannel()
  await channel.assertExchange(exchange, "direct", {durable:true})
  const q = await channel.assertQueue("eventMessages",{durable:true})
  await channel.bindQueue(q.queue, exchange, bindingKey)
  console.log("receiving message from events")
  channel.consume(q.queue, async(message)=>{
      const data = JSON.parse(message.content.toString())
      console.log(data)
      await redisClient.set(`event:${data.id}`,JSON.stringify({ticket_id: data.ticket_id, description: data.description, date: data.date, address: data.address}))
      const redisValue = await redisClient.get(`event:${data.id}`);
      console.log("Saved in Redis:", JSON.parse(redisValue));
      channel.ack(message)
  })
}
module.exports = {recieveEventInfo}