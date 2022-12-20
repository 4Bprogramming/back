require('dotenv').config();

const  {User , Professional, Ad }= require('../db')


//get users
const getName = async (req,res,next)=>{
    const {name}= req.query
    console.log(name);
    try {
       
        const allAd = await Ad.findAll({ 
            include: [{ model: Professional, include: [User] }]})

        const responseName = allAd.filter(e=> e.professional.user.name.includes(name))   

              
     res.status(200).send(responseName)     

    } catch (e) {
        next(e)
    }
    
}
module.exports={ getName}