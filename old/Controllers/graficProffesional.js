require("dotenv").config();
const express = require("express");

const {
  Appointment,
  Ad,
} = require("../db");

const getGraficProffesionalById= async (req, res, next)=>{
    const{medicalLicense}= req.params;

    const allAppointments = await Appointment.findAll({
        where: { status: "completed", professionalMedicalLicense: medicalLicense },
        include: [Ad],
      });
      let infroGraf=[]
      for (let index = 0; index < 12; index++) {
        console.log(index);
        let a = {};
        a["mes"] = `${index + 1}`;
        a["totalPrice"] = 0;

        allAppointments.forEach((appoinment) => {
          if (appoinment.date[1] === `${index}`) {
            a.totalPrice += parseInt(appoinment.ad.price);
          }
        });
        infroGraf.push(a);
      }
      res.status(200).send(infroGraf);
}
module.exports={
    getGraficProffesionalById
}