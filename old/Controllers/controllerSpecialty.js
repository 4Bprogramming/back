const express = require('express')
const {Op} = require("sequelize")
const { set } = require('../app')
const {Specialty}= require('../db')
const { Sequelize } = require("sequelize");

let specialty = [
    {name :"Odontólogo"},
    {name:"Ginecólogo"},
    {name:"Traumatólogo"},
    {name:"Psicólogo"},
    {name:"Médico Clínico"},
    {name:"Dermatólogo"},
    {name:"Oftalmólogo"},
    {name:"Otorrino"},
    {name:"Cardiólogo"},
    {name:"Pediatra"},
    {name:"Cirujano General"},
    {name:"Gastroenterólogo"},
    {name:"Urólogo"},
    {name:"Endocrinólogo"},
    {name:"Psiquiatra"},
    {name:"Neumonólogo"},
    {name:"Neurólogo"},
    {name:"Nutricionista"},
    {name:"Kinesiólogo"},
    {name:"Alergista"},
    {name:"Cirujano Plástico"},
    {name:"Fonoaudiólogo"},
    {name:"Psicoanalista"},
    {name:"Neurocirujano"},
    {name:"Reumatólogo"},
    {name:"Médico General Y Familiar"},
    {name:"Hematólogo"},
    {name:"Obstetra"},
    {name:"Cirujano Oral Y Maxilofacial"},
    {name:"Oncólogo"},
    {name:"Radiólogo"},
    {name:"Infectólogo"},
    {name:"Patólogo"},
    {name:"Analista Clínico"},
    {name:"Nefrólogo"},
    {name:"Neurofisiólogo"},
    {name:"Cirujano Vascular"},
    {name:"Médico Deportólogo"},
    {name:"Sexólogo"},
    {name:"Cirujano Cardiovascular"},
    {name:"Homeópata"},
    {name:"Cirujano Digestivo"},
    {name:"Geriatra"},
    {name:"Osteópata"},
    {name:"Cirujano Pediátrico"},
    {name:"Psicopedagogo"},
    {name:"Flebólogo"},
    {name:"Cirujano Torácico"},
    {name:"Genetista"},
    {name:"Médico Laboral"},
    {name:"Hepatólogo"},
    {name:"Médico Forense"},
    {name:"Cirujano De Cabeza Y Cuello"}, 
    {name:"Médico Estético"},
    {name:"Médico Rehabilitador"},
    {name:"Terapeuta Complementario"},
    {name:"Mastólogo"},
    {name:"Diabetólogo"},
    {name:"Podólogo"},
    {name:"Cardiólogo Pediátrico"},
    {name:"Terapista Ocupacional"},
    {name:"Anestesista"},
    {name:"Especialista En Terapia Intensiva"},
    {name:"Endocrinólogo Pediátrico"},
    {name:"Quiropráctico"},
    {name:"Médico Naturista"},
    {name:"Especialista En Medicina Nuclear"},
    {name:"Bioquímico"},
    {name:"Dermatólogo Pediátrico"},
    {name:"Gastroenterólogo Pediátrico"},
    {name:"Neumonólogo Pediátrico"},
    {name:"Enfermero"},
    {name:"Especialista En Toxicología"},
    {name:"Psicomotricista"},
    {name:"Farmacólogo"},
    {name:"Radioterapeuta"},
    {name:"Reumatólogo Pediátrico"},
    {name:"Protesista - Ortesista"},
    {name:"Óptico"},
    {name:"Optometría"},
    {name:"Oncólogo Pediátrico"},
    {name:"Urólogo Pediátrico"}
   ]

const postSpecialty = async (req, res, next)=>{
  try{
  const {name} = req.body
  console.log(name)

  const commentCreate = await Specialty.create({
    name
  })
  res.send(commentCreate).status(200)
}catch(error){res.send("la especialidad ya existe").status(404)}
  }


const getSpecialtys = async (req, res, next)=>{
try{
await Specialty.bulkCreate(specialty);
}
catch(error){null}
const AllSpecialtys = await Specialty.findAll()
res.send(AllSpecialtys)
}





module.exports={
    getSpecialtys,
    postSpecialty,
}