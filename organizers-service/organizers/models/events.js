module.exports =(sequelize, DataTypes)=>{
    const events = sequelize.define("events", {
        id:{
            type: DataTypes.INTEGER, 
            primaryKey: true,
            autoIncrement: true
        }, 
        organizer_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        vendor_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type:{
            type: DataTypes.STRING,
            allowNull: false
        },
        facility:{
            type: DataTypes.STRING,
            allowNull: false
        },
        address:{
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date:{
            type: DataTypes.DATE,
            allowNull:false
        },
        city:{
            type: DataTypes.STRING
        },
        capacity:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ticket_types:{
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false
        },
        images:{
            type: DataTypes.ARRAY(DataTypes.BLOB),
            allowNull: true
        }
    })
    return events
}