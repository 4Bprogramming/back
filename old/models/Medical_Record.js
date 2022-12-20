const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('medicalrecord', {
    id: {
      primaryKey: true,
      type: DataTypes.STRING,
      allowNull: false,
    },
    medicalrecord:{
        type: DataTypes.TEXT
    } 
  },{
    freezeTableName: true,
    timestamps: false
});
};