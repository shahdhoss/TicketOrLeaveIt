const amqp = require("amqplib")
const logger = require('../utils/logger')

async function getChannel() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost')
    const channel = await connection.createChannel()
    
    // Handle connection errors
    connection.on('error', (err) => {
        logger.error('RabbitMQ connection error:', err)
    })

    connection.on('close', () => {
        logger.error('RabbitMQ connection closed')
    })

    return { connection, channel }
}

async function updateTicketReservation(message) {
    const exchange = "ticketReservation"
    const routingKey = "payment->tickets"
    const { connection, channel } = await getChannel()
    
    try {
        await channel.assertExchange(exchange, "direct", { durable: true })
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)))
        logger.info("Payment to tickets service message sent:", message)
    } catch (error) {
        logger.error("Error sending message to tickets service:", error)
        throw error
    } finally {
        setTimeout(() => {
            channel.close()
            connection.close()
        }, 5000)
    }
}

async function updateEventCapacityandReservationStatus(message) {
    const exchange = "eventCapacity"
    const routingKey = "payment->events"
    const { connection, channel } = await getChannel()
    
    try {
        await channel.assertExchange(exchange, "direct", { durable: true })
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)))
        logger.info("Payment to events service message sent:", message)
    } catch (error) {
        logger.error("Error sending message to events service:", error)
        throw error
    } finally {
        setTimeout(() => {
            channel.close()
            connection.close()
        }, 5000)
    }
}

async function sendPaymentConfirmation(message) {
    const exchange = "paymentConfirmation"
    const routingKey = "payment->notification"
    const { connection, channel } = await getChannel()
    
    try {
        await channel.assertExchange(exchange, "direct", { durable: true })
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)))
        logger.info("Payment confirmation sent to notification service:", message)
    } catch (error) {
        logger.error("Error sending payment confirmation:", error)
        throw error
    } finally {
        setTimeout(() => {
            channel.close()
            connection.close()
        }, 5000)
    }
}

module.exports = {
    updateTicketReservation, 
    updateEventCapacityandReservationStatus,
    sendPaymentConfirmation
}