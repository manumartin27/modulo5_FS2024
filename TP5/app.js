//Se importan las librerías express y morgan, y se crea una instancia de express (la aplicación)
const express = require('express');
const app = express();
const morgan = require("morgan");

//Se configuran express y morgan
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
morgan(":method :url :status :res[content-length] - :response-time ms");

const configuracion = require("./config.json");

//cuando llega una peticion desde el cliente, debo redireccionar el pedido a su correspondiente controlador
//en la URL tengo la informacion hacia donde enviar

//Se importan los controladores, se definen las rutas de la api y se asocian con sus respectivos controladores
const medicoController = require("./controllers/medicoController.js");
app.use("/api/medico", medicoController);

const pacienteController = require("./controllers/pacienteController.js");
app.use("/api/paciente", pacienteController);

const ingresoController = require("./controllers/ingresoController.js");
app.use("/api/ingreso", ingresoController);

/*
Se configura el servidor para que escuche en el puerto especificado en la configuración.
Si falla, se muestra el error. Si no, se muestra un mensaje de exito.
*/
app.listen(configuracion.server.port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Servidor encendido y escuchando en el puerto " + configuracion.server.port);
  }
});