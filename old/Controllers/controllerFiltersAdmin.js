require("dotenv").config();
const express = require("express");

const {
  User,
  Professional,
  Appointment,
  Ad,
} = require("../db");

//get users
const getFilterUsers = async (req, res, next) => {
  const {ranking, appointment, created, active, grafic } = req.query;

  try {
    const allAppointments = await Appointment.findAll({
      where: { status: "pending" },
      include: [Ad],
    });
    const allUsers = await User.findAll({
      include: [{ model: Appointment, include: [Ad] }, { model: Professional }],
    });
    const UserLastedCreated = await User.findAll({
      where: { rol: "user" },
      order: [["createdAt", "DESC"]],
    });
    const professionalLastedCreated = await User.findAll({
      where: { rol: "professional" },
      order: [["createdAt", "DESC"]],
    });
    const bestProffesional = await User.findAll({
      include: [{ model: Appointment, include: [Ad] }, { model: Professional }],
      order: [[Professional, "ranking", "DESC"]],
      where: { rol: "professional" },
    });
    const worseProfessionals = await User.findAll({
      include: [{ model: Appointment, include: [Ad] }, { model: Professional }],
      order: [[Professional, "ranking", "ASC"]],
      where: { rol: "professional" },
    });
    const allUsersUsers = allUsers.filter((user) => user.rol === "user");
    const allProfessionals = allUsers.filter((user) => user.rol === "professional");


    
//****** respuestas segun query ******/ 

//****APPOINTMENTS */
    if (appointment && appointment !== "undefined") {
      if(appointment==="users"){
        console.log("entre aca")

        const usersAppointmentsCompleted = allUsersUsers.filter((user) =>
          user.appointments?.map(
            (appointment) => appointment.status === "completed"
          )
        );
        let infoUsers = [];
  
        usersAppointmentsCompleted.forEach((user) => {
          let a = {};
          a["userEmail"] = user.email;
          a["userEmail"] = user.name;
          a["totalAppointments"] = user.appointments.length;
          a["totalPricesAppointments"] = 0;
          a["active"] = user.active;
  
          user.appointments.map((ap) => {
            console.log(ap.ad.price);
            a.totalPricesAppointments += parseInt(ap.ad.price);
          });
  
          infoUsers.push(a);
        });
        infoUsers.sort((a,b)=>{
          if(a.totalAppointments<b.totalAppointments) return 1
          if(a.totalAppointments>b.totalAppointments) return -1
          return 0
        })
        res.status(200).send(infoUsers);
      
      }else{
        const professionalAppointmentsCompleted = allProfessionals.filter((user) =>
          user.appointments?.map(
            (appointment) => appointment.status === "completed"
          )
        );
        let infoProfessionals = [];
  
        professionalAppointmentsCompleted.forEach((user) => {
          let a = {};
          a["userEmail"] = user.email;
          a["name"] = user.name;
          //a["medicalLicense"]=user.professional.medicalLicense
          a["totalAppointments"] = user.appointments.length;
          a["totalPricesAppointments"] = 0;
          a["active"] = user.active;
  
          user.appointments.map((ap) => {
            console.log(ap.ad.price);
            a.totalPricesAppointments += parseInt(ap.ad.price);
          });
  
          infoProfessionals.push(a);
        });
        res.status(200).send(infoProfessionals);

      }
    }

    // ***  **RANKING******  


    if (ranking && ranking !== "undefined") {
      //devuelve los profesionales ordenados por mayor ranking

      if (ranking === "mejores") {
        console.log("entre en mejores")
        res.status(200).send(bestProffesional);
      } else {
        console.log("entre en peores")
        res.status(200).send(worseProfessionals);
      }
    }
///*******CREATED***** */
    if (created && created !== "undefined") {
      if (created === "users") {
        res.status(200).send(UserLastedCreated);
      } else {
        res.status(200).send(professionalLastedCreated);
      }
    }

 ///*****ACTIVE ****** */   

    if (active && active !== "undefined") {
      if (active === "yes") {
        console.log("entre en activos")
        const activeUsers = allUsers.filter((user) => user.active === true);
        res.status(200).send(activeUsers);
      } else {
        console.log("entre en inactivos")
        const inactiveUsers = allUsers.filter((user) => user.active === false);
        res.status(200).send(inactiveUsers);
      }
    }

  //*****GRAFIC*****/
      if (grafic && grafic !== "undefined") {
      let infroGraf = [];
      if (grafic === "allAppoinments") {
        for (let index = 0; index < 12; index++) {
          console.log(index);
          let a = {};
          a["mes"] = `${index + 1}`;
          a["totalPrice"] = 0;

          allAppointments.forEach((appointment) => {
            if (appointment.date[1] === `${index}`) {
              a.totalPrice += parseInt(appointment.ad.price);
            }
          });
          infroGraf.push(a);
        }
        res.status(200).send(infroGraf);
      }
    }
  } catch (error) {
    next(error);
  }
};






const designeAdmin = async (req, res, next) => {
  const { id } = req.params;
  console.log (id)
  try {
    const userDesigneAdmin = await User.update( 
    {
      rol: "admin",
    },
    {
      where: { id },
    }
  );
    if (userDesigneAdmin.rol !== "admin")
      return res
        .status(404)
        .send({ message: "No pudimos pasar a admin a este usuario" });
    else res.status(200).send({ message: "usuario pasado a admin con exito" });
  } catch (e) {
    next(e);
  }
};


const degredeAdmin = async (req, res, next) => {
  const { id } = req.params;
  console.log (id)
  try {
    const userdegredeAdmin = await User.update( 
    {
      rol: "usuario"
    },
    {
      where: { id },
    }
  );
    if (userdegredeAdmin.rol !== "usuario")
      return res
        .status(404)
        .send({ message: "No pudimos pasar a usuario a este admin" });
    else res.status(200).send({ message: "ya no es admin" });
  } catch (e) {
    next(e);
  }
};



module.exports={
  getFilterUsers,
  designeAdmin,
  degredeAdmin
}
