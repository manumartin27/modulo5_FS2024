//codigo encargado de gestionar los datos con la base de datos de los ingresos
require('rootpath')();

const mysql = require("mysql");
const configuracion = require("config.json");
const { query } = require('express');
// Agregue las credenciales para acceder a su base de datos
const connection = mysql.createConnection(configuracion.database);

connection.connect((err) => {
    if (err) {
        console.log(err.code);
    } else {
        console.log("Database INGRESO conectada");
    }
});

var metodos = {}

// --> app.get("/", listarTodo());  --> ingreso = ingresoBD.getAll((err, result) => {}
metodos.getAll = function (callback) {
    consulta = `SELECT ingreso.*,
                CONCAT(paciente.apellido, ', ', paciente.nombre) AS ApeNomPaciente, 
                CONCAT(medico.apellido, ', ', medico.nombre) AS ApeNomMedico
                FROM ingreso
                INNER JOIN paciente ON ( paciente.nro_historial_clinico = ingreso.nro_historial_paciente )
                INNER JOIN medico ON ( medico.matricula = ingreso.matricula_medico )
                ORDER BY ingreso.id_ingreso`;
    connection.query(consulta, function (err, resultados, fields) {
        if (err) {
            callback(err);
            return;
        } else {
            callback(undefined, {
                messaje: "Resultados de la consulta: ",
                detail: resultados,
            });
        }
    });
}

//--> ingresoBD.metodos.crearIngreso(req.body, (err, exito) => {});
metodos.crearIngreso = function (datosIngreso, callback) {
    ingreso = [
        datosIngreso.id_ingreso,
        datosIngreso.fecha_ingreso,
        datosIngreso.nro_habitacion,
        datosIngreso.nro_cama,
        datosIngreso.observaciones,
        datosIngreso.nro_historial_paciente,
        datosIngreso.matricula_medico
    ];
    consulta =
        "INSERT INTO INGRESO (id_ingreso, fecha_ingreso, nro_habitacion, nro_cama, observaciones, nro_historial_paciente, matricula_medico) VALUES (?, ?, ?, ?, ?, ?, ?)";

    connection.query(consulta, ingreso, (err, rows) => {
        if (err) {
            if (err.code = "ER_DUP_ENTRY") {
                callback({
                    message: "Ya existe un ingreso con el id " + datosIngreso.id_ingreso,
                    detail: err.sqlMessage
                })
            } else {
                callback({
                    message: "Error (no ER_DUP_ENTRY)",
                    detail: err.sqlMessage
                })
            }


        } else {
            callback(undefined, {
                message: "El ingreso " + datosIngreso.id_ingreso + " se registró correctamente",
                detail: rows,
            })
        }
    });
}

module.exports = { metodos }