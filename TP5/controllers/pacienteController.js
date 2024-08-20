//--- requires ------------------------------------------

const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pacienteBD = require("./../models/pacienteModel.js");


// -------------------------------------------------------- 
// --rutas de escucha (endpoint) dispoibles para PACIENTE - 
// --------------------------------------------------------

app.get("/", listarTodo);
app.get("/:nss", getByNSS);
app.post('/create', crear);
app.get('/pk/:nhc', obtenerPaciente); // se agregó "pk/" para evitar confusiones con las rutas
app.delete("/:nhc", eliminarPaciente);
app.put("/:nhc", modificarPaciente);


// --------------------------------------------------------
// ---------FUNCIONES UTILIZADAS EN ENDPOINTS -------------
// --------------------------------------------------------

function listarTodo(req, res) {
    pacientes = pacienteBD.metodos.getAll((err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    }
    );
}

function getByNSS(req, res) {
    nss = req.params.nss
    pacientes = pacienteBD.metodos.getByNSS(nss, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    }
    );
}

function crear(req, res) {
    pacienteBD.metodos.crearPaciente(req.body, (err, exito) => {
        if (err) {
            res.send(err);
        } else {
            res.json(exito);
        }
    });
}


function obtenerPaciente(req, res) {
    let nhc = req.params.nhc;
    pacienteBD.metodos.getPaciente(nhc, (err, exito) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(exito)
            }
        }
    );
}


function modificarPaciente(req, res) {
    datosPaciente = req.body;
    deEstePaciente = req.params.nhc;
    pacienteBD.metodos.update(datosPaciente, deEstePaciente, (err, exito) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(exito) 
        }
    });
}


function eliminarPaciente(req, res) {
    pacienteBD.metodos.deletePaciente(req.params.nhc, (err, exito) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.send(exito)
        }
    })
}

//exportamos a app que es nuestro servidor express al cual se le agregaron endpoinds de escucha
module.exports = app;