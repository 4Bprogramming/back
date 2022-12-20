const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('specialty', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
  },
    name:{
        type: DataTypes.STRING,
        allowNull:true,
        unique:true
    } ,
  },{
    freezeTableName: true,
    timestamps: false
});
};