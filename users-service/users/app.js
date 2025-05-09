const express = require('express');
const userRouter = require('./routers/userRouter');

const app = express();

app.use(express.json());
// app.use('/users', userRouter);
app.use("/v1/users", userRouter)
module.exports = app;
