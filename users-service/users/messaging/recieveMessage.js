const amqp = require("amqplib")
const {users}= require("../models")
async function recieveMessageFromAuth(){
    const exchange = "sendUserInfo"
    const bindingKey = "auth->users"
    const con = await amqp.connect(process.env.RABBITMQ_URL ||"amqp://localhost")
    const channel = await con.createChannel()
    await channel.assertExchange(exchange, "direct", {durable: true})
    const q = await channel.assertQueue("sendUserInfo", { durable: true });
    await channel.bindQueue(q.queue, exchange , bindingKey )
    console.log("recieving up and running")
    channel.consume(q.queue, async (message)=>{
        const data = JSON.parse(message.content.toString())
        updateUserData(data.data)
        console.log("proof of work: ", data)
        channel.ack(message)
    })
}

async function updateUserData(data) {
    try {
        if (!data || !data.user_id) {
            throw new Error("User ID is required.");
        }
        const [updatedRowsCount] = await users.update(data, {where: { id: data.user_id }})
        if (updatedRowsCount > 0) {
            console.log("success")
            return { success: true, message: 'User data updated successfully' }
        } else {
            console.log("failed:(")
            return { success: false, message: 'No matching user found to update' }
        }
    } catch (error) {
        console.error('Error updating user data:', error)
        return { success: false, message: 'Error updating user data', error: error.message }
    }
}

module.exports= recieveMessageFromAuth