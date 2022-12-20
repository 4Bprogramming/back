const express = require('express')
const {Op} = require("sequelize")
const  {User , Professional , Medicalrecord , Comments , Appointment , Ad }= require('../db')


const routefilter=async(req,res,next)=>{

    try {
        const {typeService, specialty, country, province, city}= req.query

        console.log('soy QUERY=>', req.query)
        
        const adFilter = await Ad.findAll({ 
          include: [{ model: Professional, include: [User] }],
      })
        
        let newFilter = []
        if(typeService === 'undefined'&& specialty==='undefined' && country === 'undefined' && province === 'undefined' && city === 'undefined'){
            console.log('1');
            return res.status(200).send(adFilter)
        }else{
        if(typeService === 'undefined'){
            console.log('no tengo servicio, tengo otro argumento')
            if(specialty === 'undefined'){
                console.log('no tengo especialidad, tengo otro argumento')
               
                if(country !== 'undefined' || province !== 'undefined' || city !== 'undefined'){

                    if(country !== 'undefined' && province !== 'undefined' && city !== 'undefined'){
                        newFilter= adFilter.filter(e=>e.professional.user.country=== country && e.professional.user.province=== province && e.professional.user.city===city)
                        console.log('2')
                        return res.status(200).send(newFilter)
                    }

                    if(country !== 'undefined' && province !== 'undefined'){
                        newFilter= adFilter.filter(e=>e.professional.user.country=== country && e.professional.user.province=== province)
                        console.log('3')
                        return res.status(200).send(newFilter)
                    }

                    if(country !== 'undefined' && city !== 'undefined'){
                        newFilter= adFilter.filter(e=>e.professional.user.country=== country  && e.professional.user.city===city)
                        console.log('4r')
                        return res.status(200).send(newFilter)
                    }

                    if(province !== 'undefined' && city !== 'undefined'){
                        newFilter= adFilter.filter(e=> e.professional.user.province=== province && e.professional.user.city===city)
                        console.log('5')
                        return res.status(200).send(newFilter)
                    }
                    


                    if(country !== 'undefined' ){
                        newFilter= adFilter.filter(e=>e.professional.user.country=== country)
                        console.log('6')
                        return res.status(200).send(newFilter)
                    }
                    
                    if(province !== 'undefined'){
                        console.log('6');
                        newFilter= adFilter.filter(e=> e.professional.user.province=== province)
                        return res.status(200).send(newFilter)
                        
                    }
                    else{
                        
                        newFilter= adFilter.filter(e=> e.professional.user.city=== city)
                        console.log('7')
                        return res.status(200).send(newFilter)

                    }
                }
            }
            else{
                if(country !== 'undefined' || province !== 'undefined' || city !== 'undefined'){

                    if(country !== 'undefined' && province !== 'undefined' && city !== 'undefined'){
                        newFilter= adFilter.filter(e=>e.specialty===specialty && e.professional.user.country=== country && e.professional.user.province=== province && e.professional.user.city===city)
                        console.log('8')
                        return res.status(200).send(newFilter)
                    }

                    if(country !== 'undefined' && province !== 'undefined'){
                        newFilter= adFilter.filter(e=>e.specialty===specialty && e.professional.user.country=== country && e.professional.user.province=== province)
                        console.log('9')
                        return res.status(200).send(newFilter)
                    }

                    if(country !== 'undefined' && city !== 'undefined'){
                        newFilter= adFilter.filter(e=>e.specialty===specialty && e.professional.user.country=== country  && e.professional.user.city===city)
                        console.log('10')
                        return res.status(200).send(newFilter)
                    }

                    if(province !== 'undefined' && city !== 'undefined'){
                        newFilter= adFilter.filter(e=>e.specialty===specialty && e.professional.user.province=== province && e.professional.user.city===city)
                        console.log('11')
                        return res.status(200).send(newFilter)
                    }
                    


                    if(country !== 'undefined' ){
                        newFilter= adFilter.filter(e=>e.specialty===specialty && e.professional.user.country=== country)
                        console.log('12')
                        return res.status(200).send(newFilter)
                    }
                    
                    if(province !== 'undefined'){
                        console.log('13');
                        newFilter= adFilter.filter(e=>e.specialty===specialty && e.professional.user.province=== province)
                        return res.status(200).send(newFilter)
                    }
                    else{
                        
                        newFilter= adFilter.filter(e=>e.specialty===specialty && e.professional.user.city=== city)
                        console.log('14')
                        return res.status(200).send(newFilter)
                    }
                }         
                    console.log('entre en el correcto, solo especialidad!!!!!!')
                    newFilter= adFilter.filter(e=> e.specialty===specialty)
                    
                    return res.status(200).send(newFilter)              
            }
        }
        else{
                console.log('entre en existe nombre')
                
            
                if(specialty === 'undefined'){
                    console.log('no tengo especialidad, tengo otro argumento')
                   
                    if(country !== 'undefined' || province !== 'undefined' || city !== 'undefined'){
    
                        if(country !== 'undefined' && province !== 'undefined' && city !== 'undefined'){
                            newFilter= adFilter.filter(e=>e.professional.user.country=== country && e.professional.user.province=== province && e.professional.user.city===city)
                            console.log('15')
                            return res.status(200).send(newFilter)
                        }
    
                        if(country !== 'undefined' && province !== 'undefined'){
                            newFilter= adFilter.filter(e=>e.professional.user.country=== country && e.professional.user.province=== province)
                            console.log('16')
                            return res.status(200).send(newFilter)
                        }
    
                        if(country !== 'undefined' && city !== 'undefined'){
                            newFilter= adFilter.filter(e=>e.professional.user.country=== country  && e.professional.user.city===city)
                            console.log('17')
                            return res.status(200).send(newFilter)
                        }
    
                        if(province !== 'undefined' && city !== 'undefined'){
                            newFilter= adFilter.filter(e=> e.professional.user.province=== province && e.professional.user.city===city)
                            console.log('18')
                            return res.status(200).send(newFilter)
                        }
                        
    
    
                        if(country !== 'undefined' ){
                            newFilter= adFilter.filter(e=>e.professional.user.country=== country)
                            console.log('19')
                            return res.status(200).send(newFilter)
                        }
                        
                        if(province !== 'undefined'){
                            console.log('20');
                            newFilter= adFilter.filter(e=> e.professional.user.province=== province)
                            return res.status(200).send(newFilter)
                        }
                        else{
                            
                            newFilter= adFilter.filter(e=> e.professional.user.city=== city)
                            console.log('21')
                            return res.status(200).send(newFilter)
                        }
                    }
                }
                else{
                    if(country !== 'undefined' || province !== 'undefined' || city !== 'undefined'){
    
                        if(country !== 'undefined' && province !== 'undefined' && city !== 'undefined'){
                            newFilter= adFilter.filter(e=>e.specialty===specialty && e.professional.user.country=== country && e.professional.user.province=== province && e.professional.user.city===city)
                            console.log('23')
                            return res.status(200).send(newFilter)
                        }
    
                        if(country !== 'undefined' && province !== 'undefined'){
                            newFilter= adFilter.filter(e=>e.specialty===specialty && e.professional.user.country=== country && e.professional.user.province=== province)
                            console.log('24')
                            return res.status(200).send(newFilter)
                        }
    
                        if(country !== 'undefined' && city !== 'undefined'){
                            newFilter= adFilter.filter(e=>e.specialty===specialty && e.professional.user.country=== country  && e.professional.user.city===city)
                            console.log('25')
                            return res.status(200).send(newFilter)
                        }
    
                        if(province !== 'undefined' && city !== 'undefined'){
                            newFilter= adFilter.filter(e=>e.specialty===specialty && e.professional.user.province=== province && e.professional.user.city===city)
                            console.log('soy pais=> new filter')
                            return res.status(200).send(newFilter)
                        }
                        
    
    
                        if(country !== 'undefined' ){
                            newFilter= adFilter.filter(e=>e.specialty===specialty && e.professional.user.country=== country)
                            console.log('soy pais=> new filter')
                            return res.status(200).send(newFilter)
                        }
                        
                        if(province !== 'undefined'){
                            newFilter= adFilter.filter(e=>e.specialty===specialty && e.professional.user.province=== province)
                            return res.status(200).send(newFilter)
                        }
                        else{
                            
                            newFilter= adFilter.filter(e=>e.specialty===specialty && e.professional.user.city=== city)
                            console.log('pais=>', newFilter)
                            return res.status(200).send(newFilter)
                        }
                    }         
                        console.log('entre en el correcto, solo especialidad!!!!!!')
                        newFilter= adFilter.filter(e=> e.specialty===specialty)
                        return res.status(200).send(newFilter)              
                }
                const newFilter = adFilter.filter(e=> e.serviceType===typeService)   
                      console.log('soy el sevicio')
                      return res.status(200).send(newFilter) 
            }
        }

        
    } catch (e) {
        next(e)
    }

}


module.exports = {routefilter};
