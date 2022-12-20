require("dotenv").config();
const express = require("express");
const {
  User,
  Professional,
  Medicalrecord,
  Comments,
  Appointment,
  Ad,
} = require("../db");

//get users
const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.findAll({ include: Professional, paranoid: false });
    if (allUsers.length === 0)
      return res.status(404).send({ message: "Users not found" });
    res.status(200).send(allUsers);
  } catch (e) {
    next(e);
  }
};

// get user by id
// const userId = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     console.log('soy req.params',req.params)
    

//     const userById = await User.findByPk(id, {
//       include: [{ model: Professional, include: [Ad] }],
//     });
//     console.log('soy userById',userById)
//     !userById
//       ? res.status(404).send({ message: "User by id not found" })
//       : res.status(200).send(userById);
//   } catch (e) {
//     next(e);
//   }
// };

const userId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userById = await Professional.findByPk(id);
    !userById
      ? res.status(404).send({ message: "User by id not found" })
      : res.status(200).send(userById);
  } catch (e) {
    next(e);
  }
};








//get Professionals
const getPro = async (req, res, next) => {
  try {
    const prof = await Professional.findAll({
      include: User,
    });
    if (prof.length === 0)
      return res.status(404).send({ message: "Professionals not found" });
    res.status(200).send(prof);
  } catch (e) {
    next(e);
  }
};

// get professional by id

const getProfessionalById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const profesional = await Professional.findByPk(id, { include: User });
    if (!profesional)
      return res.status(404).send("there's no professionals here! ");
    else res.status(200).send(profesional);
  } catch (e) {
    next(e);
  }
};

//get  all ADs
const getDbAd = async (req, res, next) => {
  try {
    const allAd = await Ad.findAll({
      include: [{ model: Professional, include: [User] }],
    });
    if (allAd.length === 0)
      return res.status(404).send({ message: "Advertisment not found" });
    res.status(200).send(allAd);
  } catch (e) {
    next(e);
  }
};


const getAdById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log('id', id)
    let ad = await Ad.findByPk(id, {
      include: [{ model: Professional, include: [User]}, {model:Appointment, where:{adId:id}}],
    });
    if(ad === null){
      ad = await Ad.findByPk(id, {
        include: [{ model: Professional, include: [User]}, {model:Appointment}],
      });
    }
    console.log('ad', ad)
    if (!ad) return res.status(404).send({ message: "Nope, no ads here!" });
    res.status(200).send(ad);
  } catch (e) {
    next(e);
  }
};
//******FAVORITOS */
const getFavorites = async (req, res, next) => {
  try {
    const {favorites } = req.body;
    console.log(favorites, 'soy los favoritos')
    //console.log('id', id)
    
    const allAdsFavorites= [];
    for(const e of favorites){
      const prof = await Ad.findAll({
        include: [{ model: Professional, include: [User], where:{medicalLicense:e}}],
      });
      allAdsFavorites.push(prof)
    }
     
   
      console.log(allAdsFavorites, 'soy ads')
      res.status(200).send(allAdsFavorites);
      
   
  } catch (e) {
    next(e);
  }
};



//Create a new user (post)
const createUser = async (req, res, next) => {
  console.log("llegue aca")
  try {
    let {
      email,
      password,
      name,
      dateOfBirth,
      identification,
      userimage,
      idImage,
      country,
      city,
      address,
      province,
      phone,
      rol,
      gps,
      favorites,
    } = req.body;
    console.log(req.body)
   if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)){
    return res.status(404).send("el mail no es valido")
   }
   else if(password.length <= 6){
    return res.status(404).send("la contraseña debe tener al menos 7 caracteres")
   }
   else if(dateOfBirth == ""){
    return res.status(404).send("debes indicar una fecha de nacimiento")
   }
   else if(country == ""){
    return res.status(404).send("debes indicar un pais de residencia")
   }
   else if(address == ""){
    return res.status(404).send("debes indicar una direccion fisica")
   }
  else if(rol == ""){
    return res.status(404).send("debes indicar un rol antes de registarte en la app")
   }
   else if(!idImage){
    return res.status(404).send("es necesaria la foto del dni para continuar con el registro")
   } 
    const userCreated = await User.create({
      email,
      password,
      name,
      dateOfBirth,
      identification,
      userimage,
      idImage,
      country,
      city,
      address,
      province,
      phone,
      rol,
      gps,
      favorites,
    });


    console.log(userCreated);
    if (!userCreated)
      return res.status(418).send({ message: "Oops user not created" });
    res.status(201).send({ message: "User created successfully" });
  } catch (e) {
    next(e);
  }
};

//create new professional
const createProfessional = async (req, res, next) => {
  try {
    let { medicalLicense, licenceImage, ranking, specialty, userEmail } =
      req.body;

    const professional = await Professional.create({
      medicalLicense,
      licenceImage,
      ranking,
      specialty,
      userEmail,
    });
    if (!professional)
      res
        .status(418)
        .send({ message: "Oops the Professional was not created" });
    res.status(200).send("Professional created");
  } catch (e) {
    next(e);
  }
};

//create Ads
const createAds = async (req, res, next) => {
  try {
    let {
      specialty,
      price,
      timeAvailability,
      serviceType,
      professionalMedicalLicense,
    } = req.body;

    const adCreated = await Ad.create({
      specialty,
      price,
      timeAvailability,
      serviceType,
      professionalMedicalLicense,
    });
    if (!adCreated)
      res.status(418).send({ message: "Oops the Ad was not created" });
    res.status(200).send("Ad created successfully");
  } catch (e) {
    next(e);
  }
};

//favorites
const createComments = async (req,res,next) => {

  try{
    let{comments , rating,userEmail} = req.body;

    const commentCreate = await Comments.create({
      comments,
      rating,
      userEmail
    })
    if (!commentCreate){
    res.status(418).send({ message: "Oops the comment was not created" })};
  res.status(200).send("Comments created successfully");


  }catch(err){
    next(err)
  }
}

const getComments = async (req,res,next) =>{
  try{
    const allComents = await Comments.findAll(
      {
        model: [User]
       
    });
    if (allComents.length === 0)
      return res.status(404).send({ message: "Advertisment not found" });
    res.status(200).send(allComents);

  }catch(err){
  next(err)
}
}

const addFavorites = async (req, res, next) => {
  try {
    let { medicalLicense, userEmail } = req.body;
    const user = await User.findByPk(userEmail);
    arr = user?.favorites;

    let newFavorite = [...arr, ...medicalLicense.flat()];
    await user?.update({
      favorites: newFavorite,
    });

    res.status(200).send("se agrego a favoritos");
  } catch (e) {
    next(e);
  }
};

const removeFavorites = async (req, res, next) => {
  try {
    let { medicalLicense, userEmail } = req.body;

    const user = await User.findByPk(userEmail);
    let arr = user.favorites;
    let mLicense = medicalLicense.flat();

    let newFavorite = arr.filter((fav) => fav !== mLicense[0]); // --> medicalLicense was change for mLicense
    await user.update({
      favorites: newFavorite,
    });

    res.status(200).send("se removio de favoritos");
  } catch (e) {
    next(e);
  }
};

//edit user

const editUser = async (req, res, next) => {
  try {
    let {
      password,
      name,
      dateOfBirth,
      identification,
      userimage,
      idImage,
      country,
      city,
      address,
      province,
      phone,
      rol,
      gps,
      favorites,
      deletedByAdmin,
    } = req.body;

    let { idUser } = req.params;

    const user = await User.findByPk(idUser);
    await user?.update({
      password,
      name,
      dateOfBirth,
      identification,
      userimage,
      idImage,
      country,
      city,
      address,
      province,
      phone,
      rol,
      gps,
      favorites,
      deletedByAdmin,
    });
    res.status(200).send("se actualizo la info del usuario");
  } catch (e) {
    next(e);
  }
};


//edit professional
const editProfessional = async (req, res, next) => {
  try {
    let { aboutMe, college, ranking } = req.body;
    let { MedicalLicense } = req.params;
    const professional = await Professional.findByPk(MedicalLicense);
    await professional?.update({ aboutMe, college, ranking });
    res.status(200).send("se a modificado la informacion del profesional");
  } catch (e) {
    next(e);
  }
};


//edit ads
const editAd = async (req, res, next) => {
  try {
    let { specialty, price, timeAvailability, serviceType } = req.body;
    let { AdId } = req.params;
    const ad = await Ad.findByPk(AdId);
    await ad?.update({ specialty, price, timeAvailability, serviceType });
    res.status(200).send("se ha modificado el anuncio");

  
    
  } catch (e) {
    next(e)
};
}



//Restore User By Email and password
const recoverBymail = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userRecovered = await User.update(
      {
        active:true,
      },
      {
      where: {
        email: email,
        password: password,
      },
   });

    if (userRecovered.active)
      return res
        .status(418)
        .send({ message: "No pudimos recuperar el usuario" });
    else res.status(200).send({ message: "Usuario  recuperado con exito" });
  } catch (e) {
    next(e);
  }
};



// delete user by ID
const deleteUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const userDeleted = await User.update( 
    {
      active: false,
    },
    {
      where: { id },
    }
  );
    if (userDeleted.active)
      return res
        .status(404)
        .send({ message: "No pudimos eliminar el usuario" });
    else res.status(200).send({ message: "Registro borrado con exito" });
  } catch (e) {
    next(e);
  }
};





const deleteUserByAdmin = async (req, res, next) => {
  const { id } = req.params;
  console.log (id)
  try {
    const userDeletedByAdmin = await User.update( 
    {
      deletedByAdmin: true,
    },
    {
      where: { id },
    }
  );
    if (!userDeletedByAdmin.deletedByAdmin)
      return res
        .status(404)
        .send({ message: "No pudimos eliminar el usuario" });
    else res.status(200).send({ message: "Registro borrado con exito" });
  } catch (e) {
    next(e);
  }
};

const forgivenByAdmin = async (req, res, next) => {
  const { email } = req.params;
  console.log("soy el email", email)
  try {
    const userRecovered = await User.update(
      {
        deletedByAdmin: false,
      },
      {
      where: {
        email: email
      },
   });

    if (userRecovered.deletedByUser)
      return res
        .status(418)
        .send({ message: "No pudimos recuperar el usuario" });
    else res.status(200).send({ message: "Usuario  recuperado con exito" });
  } catch (e) {
    next(e);
  }
};





module.exports = {
  getFavorites,
  getAllUsers,
  getPro,
  getDbAd,
  createUser,
  createProfessional,
  createAds,
  userId,
  getProfessionalById,
  getAdById,
  addFavorites,
  removeFavorites,
  editProfessional,
  editUser,
  editAd,
  deleteUserById,
  recoverBymail,
  createComments,
  getComments,
  deleteUserByAdmin,
  forgivenByAdmin
};

