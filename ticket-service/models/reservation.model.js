// models/reservation.model.js
// The 'use strict'; line might be added automatically by some tools, it's fine.

module.exports = (sequelize, DataTypes) => { // Sequelize CLI often passes DataTypes instead of Sequelize
    const Reservation = sequelize.define("Reservation", { // Model name often singular PascalCase by convention
      // id (Primary Key) is created automatically by Sequelize
  
      eventId: { // Foreign key to the event (from Event Service)
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: { // Foreign key to the user (from User/Auth Service)
        type: DataTypes.INTEGER, // Or DataTypes.UUID depending on your user ID type
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      seatType: {
        // Using the ENUM type to match your API spec
        type: DataTypes.ENUM("VIP", "Front Row", "Balcony", "General Admission"),
        allowNull: false,
        field: 'seat_type' // Maps this 'seatType' field to the 'seat_type' column in the DB
      },
      seatNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'seat_number' // Maps 'seatNumber' to the 'seat_number' column
      },
      status: {
        type: DataTypes.ENUM("confirmed", "cancelled", "pending"), // Add statuses as needed
        defaultValue: "confirmed",
        allowNull: false
      }
      // Sequelize automatically adds 'createdAt' and 'updatedAt' timestamp columns
    }, {
      // Optional: Specify table name explicitly if needed (Sequelize defaults to plural 'Reservations')
      // tableName: 'reservations',
      // Optional: Add other model options here if necessary
    });
  
    // --- Define Associations Here (if applicable within this service) ---
    Reservation.associate = function(models) {
      // Example: if you had a User model defined in *this* service:
      // Reservation.belongsTo(models.User, { foreignKey: 'userId' });
    };
    // --- End Associations ---
  
    return Reservation;
  };