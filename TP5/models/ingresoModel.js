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
    consulta = "select * from ingreso";
    connection.query(consulta, function (err, resultados, fields) {
        if (err) {
            callback(err);
            return;
        } else {
            callback(undefined, {
                messaje: "Resultados de la consulta",
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
                    message: "ya existe un ingreso con el id " + datosIngreso.id_ingreso,
                    detail: err.sqlMessage
                })
            } else {
                callback({
                    message: "otro error que no conocemos",
                    detail: err.sqlMessage
                })
            }


        } else {
            callback(undefined, {
                message: "el ingreso " + datosIngreso.id_ingreso + " se registro correctamente",
                detail: rows,
            })
        }
    });
}

// -->  app.delete("/:id_ingreso", eliminarIngreso);   -->   ingresoBD.metodos.deleteIngreso(req.params.id_ingreso, (err, exito) => {}); 
metodos.deleteIngreso = function (id_ingreso, callback) {
    consulta = "delete from ingreso where id_ingreso = ?";
    connection.query(consulta, id_ingreso, function (err, rows, fields) {
        if (err) {
            callback({
                message: "ha ocurrido un error",
                detail: err,
            });
        }

        if (rows.affectedRows == 0) {
            callback(undefined, "No se encontro un ingreso con el id " + id_ingreso);
        } else {
            callback(undefined, "el ingreso " + id_ingreso + " fue eliminado de la Base de datos");
        }
    });
}

module.exports = { metodos }