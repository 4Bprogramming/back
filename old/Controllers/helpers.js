const {
    User,
    Professional,
    Medicalrecord,
    Comments,
    Appointment,
    Ad,
  } = require("../db");

const makeAppointment=(dates, hours)=>{ 

    let appointments=[]
    
    for(let i=0; i<dates.length; i++ ){
     for(let j=0; j< hours.length-1;j++){
         let hr = hours[j].toString().split(':')[0]
         let min= hours[j].toString().split(':')[1]
         let currentHr=hours[j+1].toString().split(':')[0]
         let currentMin=hours[j+1].toString().split(':')[1]
         appointments.push({title:'',
         start: [dates[i].year,dates[i].month, dates[i].day,hr, min],
         end:[dates[i].year,dates[i].month, dates[i].day,currentHr, currentMin]
          })
     }
 }
 return appointments
}

const checking =async (dates,hours,professionalMedicalLicense)=>{
    const appointments=makeAppointment(dates,hours)
   console.log('appppppppp', appointments)
    const checkingApp={availableApp:[],busyApp:[]}
            for(let i=0; i< appointments.length; i++){
               
                    let startTimeApp = [appointments[i].start[3] , appointments[i].start[4]]
                    let endTimeApp = [appointments[i].end[3] , appointments[i].end[4]]
                    let dateApp =  [appointments[i].start[0] , appointments[i].start[1] ,appointments[i].start[2]]
                    
                    /* let app= await Appointment.finAll({
                        where:{
                            professprofessionalMedicalLicense:professionalMedicalLicense,
                            date: dateApp
                        }
                    }) 

                    for(let j=0; j< app.length-1; j++){
                        let startTime= Number(startTimeApp[0]) + Number(startTimeApp[1])/60

                        let startTimeFind= Number(app[j].startTime[0]) + Number(app[j].startTime[1])/60
                        
                        if(startTime[i] >= startTimeFind[j] && startTime[i] <= startTimeFind[j+1]){
                            checkingApp.busyApp.push(appointments[i])
                        }
                        else{
                            checkingApp.availableApp.push(appointments[i])
                        }

                    }
 
                    */

                    let allAppointments= await Appointment.findAll({
                        where:{
                            professionalMedicalLicense:professionalMedicalLicense,
                            startTime:startTimeApp,
                            endTime: endTimeApp,
                            date: dateApp
                        }
                    })
                    
                    if(allAppointments.length > 0){
                        
                            checkingApp.busyApp.push(appointments[i])
                    }
                    else{
                        checkingApp.availableApp.push(appointments[i])
                    }
            }
            return checkingApp
}

module.exports = {checking};