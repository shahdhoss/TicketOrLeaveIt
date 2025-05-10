const express = require('express');
const eventRouter = require('./router/eventRouter');

const app = express();

app.use(express.json());
app.use("/v1/events", eventRouter)
module.exports = app
