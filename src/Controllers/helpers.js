const {
    
    Turno
    
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

async function checking(dates,hours,profesionalIdProfesional){
    
    const appointments=makeAppointment(dates,hours)
    const checkingApp={availableApp:[],busyApp:[]}
    for(let i=0; i< appointments.length; i++){
            //     console.log('************');  
            //       console.log(' CHECKING appointments 0===>>>', appointments[i].start[0]);
            //       console.log(' CHECKING appointments 1===>>>', appointments[i].start[1]);
            //       console.log(' CHECKING appointments 2===>>>', appointments[i].start[2]);
            //       console.log('************');  
            //    console.log('entra al for');
                    let startTimeApp = `${appointments[i].start[3]}:${appointments[i].start[4]}`
                    let endTimeApp = `${appointments[i].end[3]}:${appointments[i].end[4]}`
                    let dateApp =  `${appointments[i].start[2]}-${appointments[i].start[1]}-${appointments[i].start[0]}`
                    
                    let allAppointments= await Turno.findAll({
                        where:{
                            profesionalIdProfesional: profesionalIdProfesional,
                            startTime:startTimeApp,
                            endTime: endTimeApp,
                            date: dateApp
                        }
                    })
                    // console.log('trae todos los apointments donde...=>', allAppointments);
                    
                    if(allAppointments.length > 0){
                        
                            checkingApp.busyApp.push(appointments[i])
                    }
                    else{
                        checkingApp.availableApp.push(appointments[i])
                    }
            }
            // console.log('esto devuelve checking', checkingApp);
            return checkingApp
}

module.exports = {checking};