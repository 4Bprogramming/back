// aqui van a ir todos los cotroladores Profesionales, Usuario, etc. y distintos verbos GET POST PUT DELETE

//importamos lo modelos de la DB
const {
  Profesional,
  Usuario,
  Turno,
  Admin,
  Historiaclinica,
} = require("../db");
//importamos funcion para hashear
const { hashPassword, checkPassword } = require("../helpers/handlePassword.js");
const { tokenSign } = require("../helpers/jwt");


//********************************************************GET**************************************** */

//traer todos los profesionales
const profesionales = async (req, res, next) => {
  
  try {
    const profesionales = await Profesional.findAll({ include: Turno });
    if (profesionales.length === 0)
      return res
        .status(404)
        .send({ message: "No se encontraron profesionales" });
    res.status(200).send(profesionales);
  } catch (e) {
    next(e);
  }
};

// Traer profesional por ID
const profesionalPorId = async (req, res, next) => {
  const { idProfesional } = req.params;
  try {
    const profesionalXiD = await Profesional.findByPk(idProfesional, {
      include: Turno,
    });
    if (profesionalXiD) {
      res.status(200).send(profesionalXiD);
    } else {
      return res
        .status(404)
        .send({ message: "El profesional por Id no se encontró" });
    }
  } catch (e) {
    next(e);
  }
};

// traer todos los usuarios
const usuarios = async (req, res, next) => {
  try {
    const usuarios = await Usuario.findAll({
      include: { model: Historiaclinica }
    });
    if (usuarios.length === 0)
      return res.status(404).send({ message: "No se encontraron usuarios" });
    res.status(200).send(usuarios);
  } catch (e) {
    next(e);
  }
};

//traer usuario por Email (PK)
const usuarioPorEmail = async (req, res, next) => {
  const { email } = req.params;
  try {
    const usuarioPorMail = await Usuario.findByPk(email, {
      include: {model: Historiaclinica} ,
    });
    if (usuarioPorMail) {
      res.status(200).send(usuarioPorMail);
    } else {
      return res
        .status(404)
        .send({ message: "El usuario buscado por email no se encontró" });
    }
  } catch (e) {
    next(e);
  }
};

/// historias clinicas
const traerHistoriaClinica = async (req, res, next) => {
  try {
    const historiasClinicas = await Historiaclinica.findAll();
    if (!historiasClinicas)
      return res
        .status(404)
        .send({ message: "No se encontró ninguna historia clínica" });
    res.status(200).send(historiasClinicas);
  } catch (e) {
    next(e);
  }
};

//Historia clinica por ID

const traerHistoriaClinicaPorID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const HistoriaClinicaPorID = await Historiaclinica.findByPk(id);
    if (!HistoriaClinicaPorID)
      return res
        .status(404)
        .send({ message: "La historia clinica por id no ha sido encontrada." });
    res.status(200).send({
      message: "La historia clinica ha sido encontrada",
      HistoriaClinica: HistoriaClinicaPorID,
    });
  } catch (e) {
    next(e);
  }
};

// traer todos los turnos

const traerTurnos = async (req, res, next) => {
  try {
    const todosLosTurnos = await Turno.findAll({
      include:{
        model:Profesional
      }
    });
    if (!todosLosTurnos)
      return res.status(404).send({ message: "No se encontró ningun turno" });
    res.status(200).send(todosLosTurnos);
  } catch (e) {
    next(e);
  }
};

//  trae un turno por ID
const traerTurnoPorID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const turnoPorId = await Turno.findByPk(id);
    if (!turnoPorId)
      return res
        .status(404)
        .send({ message: "El turno por id no ha sido encontrado." });
    res
      .status(200)
      .send({ message: "El turno ha sido encontrado", turno: turnoPorId });
  } catch (e) {
    next(e);
  }
};

// *********************************************** POSTS ********************************************//

//crear usuario
const crearUsuario = async (req, res, next) => {
  try {
    const hashedPassword = await hashPassword(req.body.password);
    const usuarioCreado = await Usuario.create({
      ...req.body,
      password: hashedPassword,
    });

    if (!usuarioCreado)
      return res.status(418).send({ message: "El usuario no se pudo crear" });
    res.status(201).send({ message: "Usuario creado con exito!" });
  } catch (e) {
    next(e);
  }
};

//crear profesional
const crearProfesional = async (req, res, next) => {
  console.log('llegue', req.body);
  try {
    const hashedPassword = await hashPassword(req.body.password);
    const profesionalCreado = await Profesional.create({
      ...req.body,
      password: hashedPassword,
    });
    if (!profesionalCreado)
      return res
        .status(418)
        .send({ message: "El profesional no se pudo crear" });
    res.status(201).send({ message: "Profesional creado con exito!" });
  } catch (e) {
    next(e);
  }
};

//Crear turno
const crearTurno = async (req, res, next) => {
  try {
    const turnoCreado = await Turno.create({ ...req.body });
    if (!turnoCreado)
      return res.status(418).send({ message: "El turno no pudo ser creado" });
    res.status(201).send({ message: "Turno creado con exito!" });
  } catch (e) {
    next(e);
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const { email, password, select } = req.body;

    //chequeamos el SELECT
    if (select === "usuario") {
      var respuestaDB = await Usuario.findByPk(email, {
        include: { model: Turno },
      });
    } else if (select === "profesional") {
      var respuestaDB = await Profesional.findOne({
        where: { email: email },
        include: { model: Turno },
      });
    } else if (select === "administrador") {
      var respuestaDB = await Admin.findByPk(email);
    } else {
      return res.status(404).send({
        message: `el select debe ser 'usuario', 'profesional' o 'administrador' el valor fue ${select}`,
      });
    }

    //si no existe respuesta.
    if (!respuestaDB)
      return res
        .status(401)
        .send({ message: "El usuario no se encontró con ese email." });
    const passwordCorrecto = await checkPassword(
      password,
      respuestaDB.password
    );

    //si el password es correcto manda usuario y token
    if (passwordCorrecto) {
      const tokenDeAcceso = await tokenSign(respuestaDB.dataValues, "10h");
      res.status(200).send({ usuario: respuestaDB, token: tokenDeAcceso });
    } else {
      //password incorrecto
      res.status(401).send({
        message: `El usuario ${email} no está autorizado a ingresar password erróneo.`,
      });
    }
  } catch (e) {
    next(e);
  }
};

//Crear admin
const crearAdmin = async (req, res, next) => {
  try {
    const hashedPassword = await hashPassword(req.body.password);
    const nuevoAdmin = await Admin.create({
      ...req.body,
      password: hashedPassword,
    });
    if (!Admin)
      return res
        .status(401)
        .send({ message: "El usuario no ha podido ser creado, lo siento. " });
    res
      .status(200)
      .send({ message: "Aministrador, creado con éxito", nuevoAdmin });
  } catch (e) {
    next(e);
  }
};

// Crear historia clinica
const crearHistoriaClinica = async (req, res, next) => {
  try {
    const historiaClinicaCreada = await Historiaclinica.create({ ...req.body });
    if (!historiaClinicaCreada)
      return res
        .status(401)
        .send({ message: "La historia clinica no pudo ser creada." });
    res.status(200).send({
      message: "Historia clinica creada con exito.",
      historiaClinicaCreada,
    });
  } catch (e) {
    next(e);
  }
};

//*******************Configuracion de NODEMAILER************ */
const nodemailer = require("nodemailer");
const res = require("express/lib/response");
//creamos el transporter
const transporter = nodemailer.createTransport({
  host: "host107.latinoamericahosting.com",
  port:465,
  // service:'gmail',
  secure: true,
  auth: {
    user:"no-reply@centropequenosgigantes.com",
    pass: "4b-programming"
  },
  tls: {
    rejectUnauthorized: false, // sin esto no funciona.Ver esto en producción
  },
});

//********** PASSWORD OLVIDADO*****ATENCION A ESTAS FUNCIONES*********/
const passwordOlvidado = async (req, res, next) => {
  try {

    const { email, select } = req.body;
    //chequeamos el SELECT
    if (select === "usuario") {
      var rolBuscadoEnDB = await Usuario.findByPk(email, {
        
      });
    } else if (select === "profesional") {
      var rolBuscadoEnDB = await Profesional.findOne({
        where: { email: email }
        
      });
    } else if (select === "administrador") {
      var rolBuscadoEnDB = await Admin.findByPk(email);
    } else {
      return res.status(404).send({
        message: `el select debe ser 'usuario', 'profesional' o 'administrador' el valor fue ${select}`,
      });
    }

    //si no existe respuesta.
    if (!rolBuscadoEnDB)return res.status(401).send({ message: `El ${select} no se encontró con ese email.` });

    //crear un token para devolver  y sera usado para crear el nuevo password
    const usuario = {
      email: rolBuscadoEnDB.email,
      nombre: rolBuscadoEnDB.nombre
    };

    //firmamos token
    const token = await tokenSign(usuario, "15m");

    //armamos el link para resetear
    // const link = `localhost:3001/resetPassword`; //ver en front cual es el LINK que abre la FORM
    const link = "https://grupoaguilasrl.com"

    //armamos template para enviar por email
    const mailDetails = {
      from: "no-reply@centropequenosgigantes.com",
      // to: usuario.email,
      to:`${rolBuscadoEnDB.email}`,
      subject: "Recuperar el password",
      html: `
          <H2>Hola ${rolBuscadoEnDB.nombre}!</h2>
          <h2>Este es el servicio de recuperacion de contraseña</h2>
          <h3>Para resetear el password, hace click en el siguiente Link</h3>
          <h4>
            <a href="${link}" target="_blank">Reset contraseña</a>
          </h4>  
          `   
    };
    //usamos el transporter para enviar el mail con el magic-link
    transporter.sendMail(mailDetails, (err, info) => {
      if (err) {
        return res.status(500).send(err.message);
      } else {
        res.status(200).json({
          //estas variables vienen del objeto usuario creado arriba
          message: `Hola, ¿Cómo estás? ${usuario.nombre}, te hemos enviado un email a ${usuario.email}`,
          token: token,
        });
      }
    });
  } catch (e) {
    next(e);
  }
};

//*******resetear el password****** */
//el token viene porque se creo un link anterior con ese token en la funcion
// si o si hay que incluir el TOKEN en los headers del FRONT
const resetPassword = async (req, res, next) => {
  try {
    const { password, email, select } = req.body;

    //chequeamos el SELECT
    if (select === "usuario") {
      var rolDB = await Usuario.findByPk(email, {
        include: { model: Turno },
      });
    } else if (select === "profesional") {
      var rolDB = await Profesional.findOne({
        where: { email: email },
        include: { model: Turno },
      });
    } else if (select === "administrador") {
      var rolDB = await Admin.findByPk(email);
    } else {
      return res.status(404).send({
        message: `el select debe ser 'usuario', 'profesional' o 'administrador' el valor fue ${select}`,
      });
    }

    //si no existe respuesta.
    if (!rolDB)return res.status(401).send({ message: `El ${select} no se encontró con ese email.` });

    //hasheamos password nuevamente
    const hashedPassword = await hashPassword(password);
    const usuarioActualizado = await rolDB?.update({
      password: hashedPassword,
    });
    if (!usuarioActualizado) {
        return res.status(401).send({ message: "¡No se ha podido cambiar su contraseña!" });
    } else {
        res.status(200).send({ message: "¡El cambio de su contraseña fue exitoso!" });
    }
  } catch (e) {
    next(e);
  }
};

//********************************************PUT******************************************/
// Reservar el turno por el usuario.

const modificarTurno = async (req, res, next) => {
  try {
    const { id, estado, email, formaPago, valor  } = req.body;
    const turno = await Turno.findByPk(id);

    //reservar (booked)
    if (estado === "reservado" && email) {
      await turno?.update({
        estado: estado,
      });
      res.status(200).send({
        message: "El turno fue reservado pero falta realizar el pago",
      });
    }
    //turno ya pago pasa a "pendiente" hasta ser atendido.
    else if (estado === "pendiente" && email) {
      await turno?.update({
        estado: estado,
        usuarioEmail: email,
        formaPago:formaPago,
        formaPago:valor
      });
      res
        .status(200)
        .send({ message: "¡Turno reservado el pago fue exitoso!" });
    }
    //turno cancelado por pago no completo
    else if (estado === "disponible" && email) {
      await turno?.update({
        estado: estado,
        usuarioEmail: null,
      });
      res.status(200).send({ message: "¡No se procesó el pago!" });
    }
    //turno completado con historica clinica
    else if (estado === "finalizado" && email) {
      await turno?.update({
        estado: estado,
        usuarioEmail: email,
      });
      res.status(200).send({ message: "¡Turno finalizado!" });
    }
    //usuario canceló el turno
    else if (estado === "cancelado" && email) {
      await turno?.update({
        estado: estado,
        usuarioEmail: email,
      });
      res.status(200).send({ message: "¡Turno cancelado por el usuario!" });
    } else {
      res.status(404).send("Hubo un problema con la modificación del turno");
    }
  } catch (e) {
    next(e);
  }
};

const editarprofesional = async (req, res, next) => {
  try {
    const { idProfesional } = req.params;
    const profesionalEditado = await Profesional.findByPk(idProfesional);
    if (!profesionalEditado)
      return res
        .status(404)
        .send({ message: "No se pudo encontrar el profesional para editarlo" });
    profesionalEditado?.update({ ...req.body });
    res.status(201).send({
      message: "El profesional fue editado",
      profesional: profesionalEditado,
    });
  } catch (e) {
    next(e);
  }
};

//editar usuario
const editarusuario = async (req, res, next) => {
  try {
    const { email } = req.params;
    const usuarioEditado = await Usuario.findByPk(email);
    if (!usuarioEditado)
      return res
        .status(404)
        .send({ message: "No se pudo encontrar el usuario para editarlo" });
    usuarioEditado?.update({ ...req.body });
    res
      .status(201)
      .send({ message: "El usuario fue editado", usuario: usuarioEditado });
  } catch (e) {
    next(e);
  }
};

//*********************************DAR DE BAJA O DE ALTA**************************** */

const debajaOdealta = async (req, res, next) => {
  try {
    let bajaOalta = null;
    const { email } = req.params;
    const { select } = req.body;

    //chequeamos el SELECT y damos de baja el usuario

    if (select === "usuario") {
      var resDB = await Usuario.findByPk(email);
    } else if (select === "profesional") {
      var resDB = await Profesional.findOne({ where: { email: email } });
    } else if (select === "administrador") {
      var resDB = await Admin.findByPk(email);
    } else {
      return res.status(404).send({
        message: `el select debe ser 'usuario', 'profesional' o 'administrador' el valor fue ${select}`,
      });
    }

    if (!resDB) {
      return res.status(404).send({
        message: `Usted esta buscando a un ${select} que no se encuentra con ese email.`,
      });
    } else {
      resDB.active === true
        ? (bajaOalta = "eliminado")
        : (bajaOalta = "recuperado");
      await resDB?.update({ active: !resDB.active });
      res
        .status(200)
        .send({ message: `El ${select} fue ${bajaOalta} con éxito.` });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  profesionales,
  profesionalPorId,
  usuarios,
  usuarioPorEmail,
  crearUsuario,
  crearProfesional,
  crearTurno,
  modificarTurno,
  login,
  crearAdmin,
  editarprofesional,
  editarusuario,
  crearHistoriaClinica,
  debajaOdealta,
  traerHistoriaClinica,
  traerHistoriaClinicaPorID,
  traerTurnos,
  traerTurnoPorID,
  passwordOlvidado,
  resetPassword,
};
