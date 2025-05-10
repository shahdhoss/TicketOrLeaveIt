const amqp = require('amqplib');
const redisClient = require("../redisClient");

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
      // Saving full event data
      await redisClient.set(`event:${data.id}`, JSON.stringify(data));
      if (data.ticket_id) {
        await redisClient.set(`ticket:${data.ticket_id}`, JSON.stringify(data));
      }
      channel.ack(message)
  })
}
module.exports = {recieveEventInfo}