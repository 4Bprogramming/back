const { Router } = require("express");
const {profesionales,profesionalPorId,usuarios,usuarioPorEmail,crearUsuario,crearProfesional,crearTurno,modificarTurno,login,crearAdmin,editarprofesional,editarusuario,crearHistoriaClinica,debajaOdealta,traerHistoriaClinica,traerHistoriaClinicaPorID,traerTurnos,traerTurnoPorID,passwordOlvidado,resetPassword} = require('../Controllers')
const router = Router();
//importamos helper para validar el body
const {validadorDeDatos,validadorDeAdmin,sanitizador} = require('../helpers/validations');

//validador de token para ingresar a las rutas
const {tokenVerify} = require('../helpers/jwt');
const { horariosCreados, turnoCrear } = require("../Controllers/Turnos");

///Todas las rutas acá: 

//traer todos los  profesionales
router.get("/profesionales", profesionales);//tokenVerify,

// traer profesional por ID
router.get("/profesionales/:idProfesional",profesionalPorId);//tokenVerify, 

//buscar todos los usuarios
router.get ('/usuarios',usuarios)//tokenVerify,

// buscar usuario por Email
router.get ('/usuarios/:email',usuarioPorEmail);//tokenVerify,

//traer historias clinicas
router.get('/historiaclinica',traerHistoriaClinica);//tokenVerify,

//traer historia clinica por ID
router.get('/historiaclinica/:id',traerHistoriaClinicaPorID) //tokenVerify,

// traer todos los turnos
router.get('/turnos',traerTurnos);//tokenVerify,

// traer turno por ID
router.get('/turnos/:id',traerTurnoPorID);//tokenVerify,



//***POSTS*****/
router.post('/usuarios',validadorDeDatos,crearUsuario);//
router.post('/profesionales',validadorDeDatos,crearProfesional);
// router.post('/turnos',tokenVerify,crearTurno);
router.post('/turnos',tokenVerify,turnoCrear);//
router.post('/turnos/horas',tokenVerify,horariosCreados);
// router.post('/turnos',crearTurno);
//login
router.post('/login',login);
// Crear un Admin Admin
// router.post('/crearadmin',validadorDeAdmin,tokenVerify,crearAdmin);
router.post('/crearadmin',validadorDeAdmin,crearAdmin)
//Crear historia clinica
router.post('/historiaclinica',crearHistoriaClinica)//tokenVerify,


//***PUT --> (UPDATE)***/
router.put('/turnos',modificarTurno);//tokenVerify,
router.put('/editarprofesional/:idProfesional',sanitizador,tokenVerify,editarprofesional)
router.put('/editarusuario/:email',sanitizador,tokenVerify,editarusuario)

//dar de baja usuario, admin o profesional --> se modifica el active a False.
router.put('/altabaja/:email',tokenVerify,debajaOdealta);


//***SECCION SOLO PARA PASSWORD y NODEMAILER */
// password olvidado
router.post("/password-olvidado", passwordOlvidado);

//una vez hace clic en el link lo lleva a una form que debe llenar 
//y esta form se manda a este post
router.post('/resetPassword',tokenVerify,resetPassword);
//****************************************************/

module.exports = router;
