// models/hold.model.js
module.exports = (sequelize, DataTypes) => {
    const Hold = sequelize.define("Hold", { // Model name 'Hold' -> table 'Holds'
      // id (Primary Key) created automatically
  
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER, // Or DataTypes.UUID
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      seatType: {
        type: DataTypes.ENUM("VIP", "Front Row", "Balcony", "General Admission"),
        allowNull: false,
        field: 'seat_type'
      },
      seatNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'seat_number'
      },
      // Consider adding an expiry time for holds
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true, // Or false if holds always expire
        field: 'expires_at'
      }
      // createdAt and updatedAt automatically added
    }, {
      // Optional: tableName: 'holds',
    });
  
    // No associations needed within this model usually
    Hold.associate = function(models) {
        // Associations if needed
    };
  
    return Hold;
  };