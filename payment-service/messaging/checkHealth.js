const axios = require("axios")

async function isHealthy(queue_name) {
    const url = `http://rabbitmq:15672/api/queues/%2F/${encodeURIComponent(queue_name)}`
    try{
        const res = await axios.get(url,{
            auth:{
                username: "guest",
                password:"guest"
            }
        })
        console.log(`Queue health response for ${queue_name}:`, res.data)
        return res.data.consumers > 0
    }catch(error){
        console.log("inside the rror ")
        console.log(error.message)
        return false
    }
}
module.exports = isHealthy