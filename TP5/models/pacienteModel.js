//codigo encargado de gestionar los datos con la base de datos de los pacientes
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
        console.log("Database PACIENTE conectada");
    }
});

var metodos = {}

// --> app.get("/", listarTodo());  --> paciente = pacienteBD.getAll((err, result) => {}
metodos.getAll = function (callback) {
    consulta = "select * from paciente";
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

// nhc = nro_historial_clinico
// --> app.get('/:nhc', obtenerPaciente);  -->  pacienteBD.getPaciente(nhc, () => {})
metodos.getPaciente = function (nhc, callback) {
    consulta = "select * from paciente where nro_historial_clinico = ?";

    connection.query(consulta, nhc, function (err, resultados, fields) {
        if (err) {
            callback(err);
        } else {
            if (resultados.length == 0) {
                callback(undefined, "no se encontro un paciente con el nhc:" + nhc)
            } else {
                callback(undefined, {
                    messaje: "Resultados de la consulta",
                    detail: resultados,
                });
            }
        }

    });

}

metodos.getByNSS = function (nss, callback) {
    consulta = "select * from paciente where nss = ?";

    connection.query(consulta, nss, function (err, resultados, fields) {
        if (err) {
            callback(err);
        } else {
            if (resultados.length == 0) {
                callback(undefined, "no se encontro un paciente con el nss:" + nss)
            } else {
                callback(undefined, {
                    messaje: "Resultados de la consulta con el nss" + nss,
                    detail: resultados,
                });
            }
        }

    });

}

//--> app.put("/:nhc", modificarPaciente);  --> function modificarPaciente(req, res) {}
metodos.update = function (datosPaciente, deTalPaciente, callback) {

    datos = [
        datosPaciente.nss,
        datosPaciente.nombre,
        datosPaciente.apellido,
        datosPaciente.domicilio,
        datosPaciente.codigo_postal,
        datosPaciente.telefono,
        datosPaciente.nro_historial_clinico,
        datosPaciente.observaciones,
        parseInt(deTalPaciente)
    ];
    consulta = "update paciente set nss = ?, nombre = ?, apellido = ?, domicilio = ?, codigo_postal = ?, telefono = ?, nro_historial_clinico = ?, observaciones = ? WHERE nro_historial_clinico = ?";


    connection.query(consulta, datos, (err, rows) => {
        if (err) {
            callback(err);
        } else {

            if (rows.affectedRows == 0) {
                callback(undefined, {
                    message:
                        `no se encontro un paciente con el nhc ${deTalPaciente}`,
                    detail: rows,
                })
            } else {
                callback(undefined, {
                    message:
                        `el paciente ${datosPaciente.nombre} se actualizo correctamente`,
                    detail: rows,
                })
            }

        }
    });


}

//--> pacienteBD.metodos.crearPaciente(req.body, (err, exito) => {});
metodos.crearPaciente = function (datosPaciente, callback) {
    paciente = [
        datosPaciente.nss,
        datosPaciente.nombre,
        datosPaciente.apellido,
        datosPaciente.domicilio,
        datosPaciente.codigo_postal,
        datosPaciente.telefono,
        datosPaciente.nro_historial_clinico,
        datosPaciente.observaciones
    ];
    consulta =
        "INSERT INTO PACIENTE (nss, nombre, apellido, domicilio, codigo_postal, telefono, nro_historial_clinico, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    connection.query(consulta, paciente, (err, rows) => {
        if (err) {
            if (err.code = "ER_DUP_ENTRY") {
                callback({
                    message: "ya existe un paciente con el nhc " + datosPaciente.nro_historial_clinico,
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
                message: "el paciente " + datosPaciente.nombre + " " + datosPaciente.apellido + "se registro correctamente",
                detail: rows,
            })
        }
    });
}

// -->  app.delete("/:nhc", eliminarPaciente);   -->   pacienteBD.metodos.deletePaciente(req.params.nro_historial_clinico, (err, exito) => {}); 
metodos.deletePaciente = function (nhc, callback) {
    consulta = "delete from paciente where nro_historial_clinico = ?";
    connection.query(consulta, nhc, function (err, rows, fields) {
        if (err) {
            callback({
                message: "ha ocurrido un error",
                detail: err,
            });
        }

        if (rows.affectedRows == 0) {
            callback(undefined, "No se encontro un paciente con el nhc " + nhc);
        } else {
            callback(undefined, "el paciente " + nhc + " fue eliminado de la Base de datos");
        }
    });
}

module.exports = { metodos }