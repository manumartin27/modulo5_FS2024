//--- requires ------------------------------------------

const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const medicoBD = require("./../models/medicoModel.js");


// -------------------------------------------------------- 
// --rutas de escucha (endpoint) dispoibles para MEDICO --- 
// --------------------------------------------------------

app.get("/", listarTodo);
app.get("/:especialidad", getByEspecialidad);
app.post('/create', crear);
app.get('/pk/:matricula', obtenerMedico); // se agregó "pk/" para evitar confusiones con las rutas
app.delete("/:matricula", eliminarMedico);
app.put("/:matricula", modificarMedico);


// --------------------------------------------------------
// ---------FUNCIONES UTILIZADAS EN ENDPOINTS -------------
// --------------------------------------------------------

function getByEspecialidad(req, res) {
    especialidad = req.params.especialidad
    medicos = medicoBD.metodos.getByEspecialidad(especialidad, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    }
    );
}

function listarTodo(req, res) {
    medicos = medicoBD.metodos.getAll((err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    }
    );
}

function crear(req, res) {
    medicoBD.metodos.crearMedico(req.body, (err, exito) => {
        if (err) {
            res.send(err);
        } else {
            res.json(exito);
        }
    });
}


function obtenerMedico(req, res) {
    let matricula = req.params.matricula;
    medicoBD.metodos.getMedico(matricula, (err, exito) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(exito)
            }
        }
    );
}


function modificarMedico(req, res) {
    datosMedico = req.body;
    deEsteMedico = req.params.matricula;
    medicoBD.metodos.update(datosMedico, deEsteMedico, (err, exito) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(exito) 
        }
    });
}


function eliminarMedico(req, res) {
    medicoBD.metodos.deleteMedico(req.params.matricula, (err, exito) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.send(exito)
        }
    })
}

//exportamos a app que es nuestro servidor express al cual se le agregaron endpoinds de escucha
module.exports = app;