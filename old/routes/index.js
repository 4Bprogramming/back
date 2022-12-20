const { Router } = require("express");
//const {Appointment} = require('../db')
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const {
  createAppointments,
  getAppointments,
  getAppointmentsByProfessional,
  getAppointmentsByAd,
  editAppointments,
  createCancellAppointmentsByUser,
  getAppointmentById,
  getAppointmentsByAdAvailable,
  getAppointmentsByUser,
  deleteAppointment,
  traemeTodo,
  createHours,
} = require("../Controllers/controllerAppointments");
const {
  getGraficProffesionalById,
} = require("../Controllers/graficProffesional");
const { routefilter } = require("../Controllers/controllerFilters");


const {
  getAllUsers,
  getPro,
  getDbAd,
  createUser,
  createProfessional,
  createAds,
  getProfessionalById,
  userId,
  getAdById,
  addFavorites,
  removeFavorites,
  editProfessional,
  editUser,
  editAd,
  deleteUserById,
  recoverBymail,
  deleteUserByAdmin,
  forgivenByAdmin,
  createComments,
  getComments,
  getFavorites
} = require("../Controllers/getPostControllers");
const { getName } = require("../Controllers/controllerSearch");
const {
  getFilterUsers,
  designeAdmin,
  degredeAdmin,
} = require("../Controllers/controllerFiltersAdmin");
const {
  getSpecialtys,
  postSpecialty,
} = require("../Controllers/controllerSpecialty");


const router = Router();

//get users
router.get("/users", getAllUsers);

// get user by id
router.get("/user/:id", userId);

//get all professionals
router.get("/professionals", getPro);

router.get("/professionals/:id", getProfessionalById);

//get Ad
router.get("/anuncios", getDbAd);

router.get("/ad/:id", getAdById);

//get filter
router.get("/filter", routefilter);

//get names

router.get("/ads", getName);

// //get countries

// router.get("/countries", countries);
// router.get("/states/:countryId", states);
// router.get("/cities/:countryId/:stateId", cities);

//get Appointments
router.get("/appointments", getAppointments);

//get AppointmentsByProfessional
router.get(
  "/appointments/:professionalMedicalLicense",
  getAppointmentsByProfessional
);

//get AppointmentsByAd

router.get("/appointments/ad/:adId", getAppointmentsByAdAvailable);

router.get("/appointments/id/:id", getAppointmentById);

router.get("/appointments/user/:userEmail", getAppointmentsByUser);

router.get("/appointments/all/:medicalLicense", traemeTodo);

router.get("/comments/all", getComments);

//get proffesional grafic by medical license
router.get("/grafic/:medicalLicense", getGraficProffesionalById);

//get ads favorites
router.post('/favoritesAds', getFavorites)

//*******ADMIN ROUTES */
router.get("/filterAdmin", getFilterUsers);


// ******** POSTS ***********//

// Create a new User.
router.post("/users", createUser);

//create professional
router.post("/professionals", createProfessional);

//Payment

// router.post("/payment", PaymentRoute);

//create Ads
router.post("/ad", createAds);

//createAppointment


router.post("/appointment", createAppointments);
router.post("/appointment/cancelled/:idApp", createCancellAppointmentsByUser);
router.post("/appointment/hours", createHours);

router.post("/comments/user", createComments);


//recover user by mail and password
router.put("/restore", recoverBymail);

//delete user by id
router.put("/delete/:id", deleteUserById);

//******PUT ************//

router.put("/addFavorites", addFavorites);

router.put("/removeFavorites", removeFavorites);

router.put("/user/:idUser", editUser);

router.put("/ad/:AdId", editAd);

router.put("/professional/:MedicalLicense", editProfessional);

//put appointments


router.put("/appointments/edit/:AppId", editAppointments);

router.delete("/delete/appointment/:id", deleteAppointment);

router.put("/Admindelete/:id", deleteUserByAdmin);

router.put("/Adminforgive/:email", forgivenByAdmin);

router.put("/adminDesigne/:id", designeAdmin);

router.put("/adminDegrede/:id", degredeAdmin);



router.get("/specialtys", getSpecialtys);

router.post("/specialty", postSpecialty);


module.exports = router;
