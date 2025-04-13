module.exports = (sequelize, DataTypes)=>{
    const organizers = sequelize.define("organizers",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        organization_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        industry_type:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        primary_contact_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username:{
            type: DataTypes.STRING,
            allowNull:false
        }
    })
    return organizers
}