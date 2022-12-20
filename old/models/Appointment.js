const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('appointment', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
    },
    // startTime:{
    //     type: DataTypes.ARRAY(DataTypes.STRING),
    //     allowNull:false
    // },
    // endTime:{
    //     type: DataTypes.ARRAY(DataTypes.STRING),
    //     allowNull:false
    // },
    // date:{
    //     type: DataTypes.ARRAY(DataTypes.STRING),
    //     allowNull:false
    // },
    services:{
        type: DataTypes.TEXT,
        allowNull:true
    },
    medicalRecord:{
        type: DataTypes.TEXT,
        allowNull:true
    },
    rating:{
        type: DataTypes.STRING,
        allowNull:true
    },
    status:{
        type: DataTypes.ENUM('pending' , 'completed', 'booked', 'available', 'cancelled','absent', "terminated"),
        allowNull:false
    }
  },{
    freezeTableName: true,
    timestamps: false
});
};