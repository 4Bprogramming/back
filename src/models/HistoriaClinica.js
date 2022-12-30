const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('historiaclinica', {
    id_hc: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
    },
    mensaje:{
        type: DataTypes.TEXT
    },
    fecha:{
        type:DataTypes.STRING,
    },
    hora:{
        type: DataTypes.STRING
    },
    nombreProfesional:{
        type: DataTypes.STRING
    }
  },{
    freezeTableName: true,
    timestamps: false
});
};