//--- requires ------------------------------------------

const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const ingresoBD = require("./../models/ingresoModel.js");


// -------------------------------------------------------- 
// --rutas de escucha (endpoint) dispoibles para INGRESO -- 
// --------------------------------------------------------

app.get("/", listarTodo);
app.post('/create', crear);


// --------------------------------------------------------
// ---------FUNCIONES UTILIZADAS EN ENDPOINTS -------------
// --------------------------------------------------------

function listarTodo(req, res) {
    ingresos = ingresoBD.metodos.getAll((err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    }
    );
}

function crear(req, res) {
    ingresoBD.metodos.crearIngreso(req.body, (err, exito) => {
        if (err) {
            res.send(err);
        } else {
            res.json(exito);
        }
    });
}

//exportamos app que es nuestro servidor express a la cual se le agregaron endpoinds de escucha
module.exports = app;