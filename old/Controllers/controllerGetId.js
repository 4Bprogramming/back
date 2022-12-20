require('dotenv').config();
const express = require('express')
const  {User , Professional , Medicalrecord , Comments , Appointment , Ad }= require('../db')
const axios = require('axios')

export const userId=async(idEmail)=>{
    return await User.findAll({
        include: [ {
            model: User,
        }],
        where:{
            id : idEmail
        }
})
}