const express = require("express");
// const {che}
const {
 Turno
} = require("../db");
const { checking } = require("./helpers");

const horariosCreados = async(req, res, next)=>{
    try {
        
        let {tiempoInicio, tiempoFinal, duracion}=req.body
        // console.log('la action entro al back con estos datos==>', req.body);

        if(!tiempoInicio) return res.status(400).send('falta tiempo inicial')
        if(!tiempoFinal) return res.status(400).send('falta tiempo final')
        if(!duracion) return res.status(400).send('falta intervalo de duración de cada turno')
    
        let timeEnd = tiempoFinal.split(':')
        let timeM = tiempoInicio.split(':')
    
        //recibo 8:30 ===> 8,5
        let x=Number(timeM[0]) + Number(timeM[1])/60
        let y= Number(timeEnd[0]) + Number(timeEnd[1])/60
    
        let current = x
        let next= current
        let numHour=[]
        let durationtime
    
        if(duracion!==60){
        durationtime =parseFloat((duracion/60).toFixed(2))
        }
        if(duracion===60){
        durationtime = 1
        }
        //mientras next sea menor a la hora final transformada en numero Real, next se agrega al array numHour
        do {
            current =next + durationtime
            numHour.push(next)
            next=current
        } 
    
        while (next <= y);
    
        // creo un array de objetos en base a los horarios obtenidos en numHour
        let objHours = numHour.map(e => {
        return{ start: e, end:e + durationtime}   
        });
    // console.log('linea275 ctrlapp, objHours',objHours)
    
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
    //    console.log('creo estos horarios sin filtros', hours)
        !Array.isArray(hours)? hoursFilter.push(hours): hoursFilter=[...hours]
   console.log('tengo en back estos horarios creados===>', hoursFilter)
     return res.status(200).send(hoursFilter)
        
    } catch (error) {
        next(error)
    }

}


//ruta creadora de turnos
const turnoCrear=async(req, res, next)=>{
    try {
        const {hours, dates, profesionalIdProfesional}= req.body
      
        const appointments = await checking(dates,hours,profesionalIdProfesional)
        
       if(appointments.availableApp.length> 0){
       
            let apps = appointments.availableApp.map((app)=>{
                return{
                startTime:`${app.start[3]}:${ app.start[4]}`,
                endTime: `${app.end[3] }:${ app.end[4]}`,
                date: `${app.start[2]}-${app.start[1]}-${app.start[0]}`,
                profesionalIdProfesional: profesionalIdProfesional,
                }
            })
                 console.log('Turnos a enviar a base de datos=====>',apps)
               await Turno.bulkCreate(apps);  
    
               res.status(200).send('Los turnos fueron creados'); 
       }
        else{
         res.status(418).send({ message: 'No se pudieron crear los turnos' });
        } 
      
        
    } catch (error) {
        next (error)
    }
        
}

module.exports={horariosCreados, turnoCrear}