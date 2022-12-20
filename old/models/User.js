const {
    DataTypes,
    STRING
} = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('user', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
        },
        email: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dateOfBirth: {
            type:DataTypes.DATEONLY,
            allowNull: false
        },
        identification: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userimage: {
            type: DataTypes.STRING
        },
        idImage: {
            type: DataTypes.STRING,
            allowNull: false
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        province: {
            type: DataTypes.STRING,
            allowNull:true
            
        },
        phone: {
            type: DataTypes.STRING
        },
        rol: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gps: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // favorites:{
        //     type: DataTypes.ARRAY(DataTypes.STRING),
        //     allowNull:true
        // },
        active:{
            type:DataTypes.BOOLEAN,
            defaultValue:true
        },
        deletedByAdmin:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        }
    }, {
        freezeTableName: true,
    }
    );
};