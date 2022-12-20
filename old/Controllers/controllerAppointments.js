
const {checking}= require('../Controllers/helpers')
const express = require("express");
const {
  User,
  Professional,
  Medicalrecord,
  Comments,
  Appointment,
  Ad,
} = require("../db");

//riuta creadora de turnos
const createAppointments=async(req, res, next)=>{
    try {
        const {hours, dates, professionalMedicalLicense, ad}= req.body
        console.log('hrs', hours)
        const appointments = await checking(dates,hours,professionalMedicalLicense)
        console.log('soy el ad', ad)
        console.log('appointments', appointments)
       if(appointments.availableApp.length> 0){
       
            let apps = appointments.availableApp.map((app)=>{
                return{
                startTime:[app.start[3] , app.start[4]],
                endTime: [app.end[3] , app.end[4]],
                date: [app.start[0] , app.start[1] ,app.start[2]],
                status: 'available',
                professionalMedicalLicense: professionalMedicalLicense,
                adId: ad 
                }
            })
       
               await Appointment.bulkCreate(apps);  
    
               res.status(200).send(appointments); 
       }
        else{
         res.status(418).send({ message: 'these were not created' });
        } 
      
        
    } catch (error) {
        next (error)
    }
        
}
//ruta para todos los turnos
const getAppointments = async(req,res,next)=>{
    try{
        let app = await Appointment.findAll()

        res.send(app)


    }catch(e){
        next(e)
    }
}
//trae los turnos de cada profesional (se usa en el perfil del medico, para ver los turnos en cada anuncio por separado)
const getAppointmentsByProfessional = async(req,res,next)=>{
    const { professionalMedicalLicense, id} = req.params;
    console.log('llegue')
    try{
        
        let app = await Appointment.findAll({
            where:{professionalMedicalLicense: professionalMedicalLicense}, include:[Ad]})

        res.send(app)
    }catch(e){
        next(e)
    }
}
//trae turnos disponibles
const getAppointmentsByAdAvailable = async(req,res,next)=>{
    let {adId} = req.params
    try{
        let app = await Appointment.findAll({
            where:{
                adId:adId,
                status:'available'
            }
    })

    res.send(app)
    }catch(e){
        next(e)
    }
}

//ruta para traer turnos por usuario
const getAppointmentsByUser = async(req,res,next)=>{
    let {userEmail} = req.params
    try{
        let app = await Appointment.findAll({where:{userEmail:userEmail},include:[User, Ad, { model: Professional, include: [User] }] })
        res.send(app)
    }catch(e){
        next(e)
        res.send("El usuario no cuenta con turnos")
    }
}
//ruta para traer cada turno individualmente. tiene asociado el anuncio asi sacamos datos de tipo de turno y precio
const getAppointmentById = async (req,res,next) => {
    let {id} = req.params
    try{
        const appoinment = await Appointment.findByPk(id, { include: [Ad, User, { model: Professional, include: [User] } ]});
        if (!appoinment)
          return res.status(404).send("there's no professionals here! ");
        else res.status(200).send(appoinment);
    }catch(err){
        next(err)
    }
}
//trae por profesional toda la info de los turnos que tienen (se renderiza en el perfil del medico)
const traemeTodo = async (req, res, next) => {
    try {
      const {medicalLicense} = req.params;
      const profesional = await Professional.findByPk(medicalLicense,{include:[{model:Appointment, include:[Ad, User]}]})
      if (!profesional)
        return res.status(404).send("there's no professionals here! ");
      else res.status(200).send(profesional);
    } catch (e) {
      next(e);
    }
  };
 //funcion que va cambiando los estados de los turnos
const editAppointments = async (req, res, next) => {
    try {
      let { userEmail, status, medicalRecord, rating } = req.body;
      let { AppId} = req.params;
 
        //selected appointments
      if(userEmail && status==='booked' && !medicalRecord && !rating){
        const app = await Appointment.findByPk(AppId);
        await app?.update({ status: status });
        return res.status(200).send("se ha modificado el status a booked");
      }
 
      //Appointment paid out

      if(userEmail && status==='pending' && !medicalRecord && !rating){
        const app = await Appointment.findByPk(AppId);
        await app?.update({ userEmail:userEmail, status: status });
        return res.status(200).send("el turno ha sido pagado");
      }
      //Appointment paid cancell
      if(userEmail && status==='available' && !medicalRecord && !rating){
        const app = await Appointment.findByPk(AppId);
        await app?.update({ status: status });
        return res.status(200).send("el turno esta disponible");
      }
      //Appointment completed
      if(!status && medicalRecord && !rating){
        const app = await Appointment.findByPk(AppId);
        await app?.update({ status: 'completed', medicalRecord: medicalRecord});
        return res.status(200).send("se ha modificado el status a completado");
        //entra useEffect cdo usuario entra a su perfil, que va a tener un condicional que si el status de su turnos es completed y rating===null dispara un modal para calificar ese turno
      }
      //user complet rating
      if(userEmail && !status && !medicalRecord && rating){
        const app = await Appointment.findByPk(AppId);
        await app?.update({ rating: rating });
        return res.status(200).send("se ha modificado el raiting");
      }
      // user absent
      if(status=== 'absent'){
        const app = await Appointment.findByPk(AppId);
        await app?.update({ status: status });
        return res.status(200).send("se ha modificado el status a ausente");
      }
      
      if(userEmail && status=== 'cancelled'){
        const app = await Appointment.findByPk(AppId);
        await app?.update({ status: status });
        return res.status(200).send("el usuario ha cancelado el turno");
      }
      if(status=== 'cancelled'){
        const app = await Appointment.findByPk(AppId);
        await app?.update({ status: status });
        return res.status(200).send("el usuario ha cancelado el turno");
      }
      
      
    } catch (e) {
      next(e)
  };
  }
//funcion que cancela un turno y lo vuelve a crear para que vuelva a estar disponibe
  const createCancellAppointmentsByUser=async(req, res, next)=>{
    try {    
        const {idApp}=req.params
        console.log('idaaaa',idApp)
        if(idApp){

            const appointments = await Appointment.findByPk(idApp)
    
            console.log('appsssss', appointments.dataValues)
           
                let apps ={ 
                  
                    startTime:appointments.dataValues.startTime,
                    endTime: appointments.dataValues.endTime ,
                    date: appointments.dataValues.date,
                    status: 'available',
                    professionalMedicalLicense: appointments.dataValues.professionalMedicalLicense,
                    adId: appointments.dataValues.adId
          
                    }
                    
                   await Appointment.create(apps);  
        
                return  res.status(200).send('se creo'); 
        }else{
            res.status(418).send({ message: 'these were not created' });
        }        
    } catch (error) {
        next (error)
    }       
}
//funcion para que el medico pueda eliminar un turno creado por el
const deleteAppointment = async(req,res,next)=>{
	let {id} = req.params
    console.log(id)
	try {
		await Appointment.destroy({where:{id}})
		res.send('appointment deleted')		
	} catch (error) {
		next(error)
	}
}



const createHours = async(req, res, next)=>{
    try {
        
        let {startTime, endTime, duration}=req.body
        console.log('la action entro al back con estos datos==>', req.body);

        if(!startTime) return res.status(400).send('falta tiempo inicial')
        if(!endTime) return res.status(400).send('falta tiempo final')
        if(!duration) return res.status(400).send('falta intervalo de duración de cada turno')
    
        let timeEnd = endTime.split(':')
        let timeM = startTime.split(':')
    
        //recibo 8:30 ===> 8,5
        let x=Number(timeM[0]) + Number(timeM[1])/60
        let y= Number(timeEnd[0]) + Number(timeEnd[1])/60
    
        let current = x
        let next= current
        let numHour=[]
        let durationtime
    
        if(duration!==60){
        durationtime =parseFloat((duration/60).toFixed(2))
        }
        if(duration===60){
        durationtime = 1
        }
        //mientras next sea menor a la hora final transformada en numero Real, next se agrega al array numHour
        do {
            current =next + durationtime
            numHour.push(next)
            next=current
        } 
    
        while (next < y);
    
        // creo un array de objetos en base a los horarios obtenidos en numHour
        let objHours = numHour.map(e => {
        return{ start: e, end:e + durationtime}   
        });
    
    
    // creo el horario de comienzo y de finalización de cada turno
        let hours= objHours.map(el=>{
    //crear el horario de inicio de turno
                let hrStart=el.start.toString().split('.')[0]
                var hourStart = hrStart;
                hourStart = (hourStart < 10)? '0' + hourStart : hourStart;
                var minStart = Math.round((el.start-Number(hrStart))*60)
                
                let rStart= minStart.toString().split('')
             // rStart transforma los min en un array para manejar el redondeo en cada circunstancia
                if(rStart.length===1 && Number(rStart[0]) < 10){
                    if(Number(rStart[0])<=5){
                        rStart[0]= '0'
                        rStart=[rStart[0]]
                            minStart='00'
                    }
    
                    if(Number(rStart[0]) > 5){
                           minStart='10'
                    }
                }
    
                if(rStart[1]!=='0' && rStart[1]<'5'){
                    rStart[1]= '0'
                    rStart=[rStart[0], rStart[1]]
                    minStart= rStart.join('')   
                }
    
                if(rStart[1]!=='0' && rStart[1]>'5'){
                    rStart[1]= '0'
                    let x = rStart[0]
                    rStart[0]= Number(x) + 1
                    rStart=[rStart[0], rStart[1]]
                
                    minStart= rStart.join('')   
                }
    
                let minuteStart = minStart
            // manejo para que la hora no quede en 60 min
                if(minuteStart==='60'){
                    minuteStart ='00'
                    let h = Number(hourStart)+1
                    hourStart = h.toString()
                }
    
                // minute = (minute < 10)? '0' + minute : minute;
                
    //crear horario de finalización de turno
                let hrEnd=el.end.toString().split('.')[0]
                var hourEnd = hrEnd;
                hourEnd = (hourEnd < 10)? '0' + hourEnd : hourEnd;
                var minEnd = Math.round((el.end-Number(hrEnd))*60)
                
                
                let rEnd= minEnd.toString().split('')
                 // rStart transforma los min en un array para manejar el redondeo en cada circunstancia
                if(rEnd.length===1 && Number(rEnd[0]) < 10){
                    if(Number(rEnd[0])<=5){
                    rEnd[0]= '0'
                    rEnd=[rEnd[0]]
                        minEnd='00'
                    }
                    if(Number(rEnd[0]) > 5){ 
                        minEnd='10'
                    }
                }
    
                if(rEnd[1]!=='0' && rEnd[1] < '5'){
                    rEnd[1]= '0'
                    rEnd=[rEnd[0], rEnd[1]]
                    
                    minEnd= rEnd.join('')   
                }
    
                if(rEnd[1]!=='0' && rEnd[1] >'5'){
                    rEnd[1]= '0'
                    let z = rEnd[0]
                    rEnd[0]= Number(z) + 1
                    rEnd=[rEnd[0], rEnd[1]]
                
                minEnd= rEnd.join('')   
                }
    
                let minuteEnd = minEnd
             // manejo para que la hora no quede en 60 min
                if(minuteEnd==='60'){            
                    minuteEnd ='00'                
                    let h = Number(hourEnd)+1            
                    hourEnd = h.toString()
                }
                // devuelvo al array hours un objeto con horario de inicio y horario de finalizacion del turno
                return{
                start:hourStart + ':' + minuteStart,
                end:hourEnd + ':' + minuteEnd
                } 
        })
    //para que no tome la hora final como comienzo de un turno y si es un solo turno lo transformamos en array.
        let hoursFilter= []
        console.log('creo estos horarios sin filtros', hours)
        !Array.isArray(hours)? hoursFilter.push(hours): hoursFilter=[...hours]
    console.log('tengo en back estos horarios creados===>', hoursFilter)
     return res.status(200).send(hoursFilter)
        
    } catch (error) {
        next(error)
    }

}


module.exports={createAppointments, getAppointments, getAppointmentsByProfessional,
    getAppointmentsByAdAvailable, getAppointmentsByUser,editAppointments,
      createCancellAppointmentsByUser,getAppointmentById, deleteAppointment, traemeTodo, createHours }

