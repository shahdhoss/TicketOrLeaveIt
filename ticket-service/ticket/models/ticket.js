module.exports = (sequelize, DataTypes) => {
    const tickets = sequelize.define("tickets", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        event_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'events', 
                key: 'id'
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',  
                key: 'id'
            }
        },
        seat_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'available'  
        },
        purchased_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        
    });

   
    tickets.associate = (models) => {
        tickets.belongsTo(models.users, { foreignKey: 'user_id', as: 'user' });
        tickets.belongsTo(models.events, { foreignKey: 'event_id', as: 'event' });
    }

    return tickets;
}
