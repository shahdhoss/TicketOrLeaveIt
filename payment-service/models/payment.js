module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Payment', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      paymobOrderId: {
        type: DataTypes.STRING,
        unique: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, 
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  };