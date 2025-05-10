module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define("users", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        profilePicture: {
            type: DataTypes.BLOB,
            allowNull: true
        },
        oauth_provider: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'local'
        },
        oauth_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        last_login: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['email']
            },
            {
                fields: ['oauth_provider', 'oauth_id']
            }
        ]
    });
    return users;
};
