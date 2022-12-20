const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('professional', {
    id: {
      primaryKey: true,
      type: DataTypes.STRING,
      allowNull: false,
    },
   
    nombre:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellido:{
      type:DataTypes.STRING,
      allowNull: false,
    },
    email:{
      type:DataTypes.STRING,
      allowNull: false,
    },
    matricula:{
      type:DataTypes.STRING,
      allowNull: false,
    }

  },{
    freezeTableName: true,
    timestamps: false
});
};
