module.exports = (sequelize, DataTypes)=>{
    const vendors = sequelize.define("vendors", {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:
        {
            type: DataTypes.STRING,
            allowNull: false
        },
        genre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        biography:{
            type: DataTypes.STRING,
            allowNull: false
        },
        profile_picture:{
            type: DataTypes.BLOB,
            allowNull: true   
        }
    })
    return vendors
}