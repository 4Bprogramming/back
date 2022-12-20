const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('profesional', {
    idProfesional: {
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
    password:{
      type:DataTypes.STRING,
      allowNull:false
    },
    matricula:{
      type:DataTypes.STRING,
      allowNull: false,
    },
    imagenProfesional: {
      type: DataTypes.STRING,
      allowNull: true,
  },
  especialidad:{
    type:DataTypes.STRING,
    allowNull:true
  },
  celular:{
    type:DataTypes.STRING,
    allowNull:true
  },
  fullName: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${this.nombre} ${this.apellido}`;
    }
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }},
  {
    freezeTableName: true,
    timestamps: false
});
};
