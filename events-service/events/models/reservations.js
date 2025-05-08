module.exports= (sequelize, DataTypes) =>{
    const reservations = sequelize.define("reservations", {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true
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
        }
    })
    return reservations
}
