const express = require('express');
const app = express();
const morgan = require("morgan");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
morgan(":method :url :status :res[content-length] - :response-time ms");

const configuracion = require("./config.json");

//cuando llega una peticion desde el cliente, debo redireccionar el pedido a su correspondiente controlador
//en la URL tengo la informacion hacia donde enviar

const medicoController = require("./controllers/medicoController.js");
app.use("/api/medico", medicoController);

const pacienteController = require("./controllers/pacienteController.js");
app.use("/api/paciente", pacienteController);

const ingresoController = require("./controllers/ingresoController.js");
app.use("/api/ingreso", ingresoController);

app.listen(configuracion.server.port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Sevidor encendido y escuchando en el puerto " + configuracion.server.port);
  }
});