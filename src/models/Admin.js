const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('admin', {
    email:{
      primaryKey: true,
      type: DataTypes.STRING,
      allowNull: false,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  },{
    freezeTableName: true,
    timestamps: false
});
};