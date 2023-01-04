const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('turno', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
    },
    startTime:{
        type: DataTypes.STRING,
        allowNull:false
    },
    endTime:{
        type: DataTypes.STRING,
        allowNull:false
    },
    date:{
        type: DataTypes.STRING,
        allowNull:false
    },
    formaPago:{
        type: DataTypes.STRING,
      
    },
    valor:{
        type: DataTypes.STRING,
        allowNull:false,
        defaultValue:"0"
    },
    
    estado:{
        type: DataTypes.ENUM('pendiente' , 'finalizado', 'cancelado','disponible','reservado'),
        allowNull:false,
        defaultValue: "disponible"
    }

  },{
    freezeTableName: true,
    timestamps: false
});
};
