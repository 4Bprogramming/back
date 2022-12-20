const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('comments', {
    id: {
      primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
    },
    comments:{
        type: DataTypes.TEXT
    },
    rating:{
      type:DataTypes.STRING
    }
  },{
    freezeTableName: true,
    timestamps: false
});
};