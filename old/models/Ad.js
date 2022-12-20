const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('ad', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            allowNull: false,
        },
        specialty: {
            type: DataTypes.STRING,
            allowNull: true
        },
        price: {
            type: DataTypes.STRING,
            allowNull: false
        },
        timeAvailability: {
            type: DataTypes.STRING,
            allowNull: false
        },
        serviceType: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });
};
