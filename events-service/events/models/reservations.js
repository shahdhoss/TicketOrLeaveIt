const ticket = require("../../../ticket-service/ticket/models/ticket")

module.exports= (sequelize, DataTypes) =>{
    const reservations = sequelize.define("reservations", {
        id:{
            type: DataTypes.UUID,
            primaryKey: true, 
        },
        user_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        }, 
        event_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        }, 
        status: {
            type : DataTypes.ENUM("pending", "accepted", "canceled"),
            allowNull: false,
            defaultValue: "pending"
        },
        payment_id: {
            type: DataTypes.INTEGER,
            allowNull:true
        },
        ticket_id:{
            type: DataTypes.UUID,
            allowNull:true
        }
    })
    return reservations
}
