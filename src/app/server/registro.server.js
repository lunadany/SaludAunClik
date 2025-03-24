const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const { error } = require('console');

// const route = express.Router();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true 
}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'saludAUnClik',
    connectionLimit: 10
});
connection.query('SELECT * FROM registro',(error, result) => {
    if (error) {
    console.log('Errro al obtener los datos del registro', error);
    return;
    }
    console.log('Datos obtenidos del registro:', result);
});

// Método POST para guardar datos en la tabla 'registro' //////////////////////////////////////////////////////////////////
app.post('/api/registro/:correo', async (req, res) => {
    try {
        console.log('Datos recibidos en el servidor:', req.body);
        const { correo, apellidoPaterno, apellidoMaterno, nombre, telefono, alergias, sexo, motivoConsulta, diaCita, horaCita } = req.body;
        // Verifica que no lleguen valores vacíos
        if (!correo || !apellidoPaterno || !apellidoMaterno || !nombre || !telefono || !alergias || !sexo || !motivoConsulta || !diaCita || !horaCita) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }
        // Validación del correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            return res.status(400).json({ error: 'Correo electrónico inválido' });
        }
        const query = 'INSERT INTO registro (correo, apellidoPaterno, apellidoMaterno, nombre, telefono, alergias, sexo, motivoConsulta, diaCita, horaCita) VALUES (?,?,?,?,?,?,?,?,?,?)';
        // Ejecutar la consulta con parámetros
        connection.query(query, [correo, apellidoPaterno, apellidoMaterno, nombre, telefono, alergias, sexo, motivoConsulta, diaCita, horaCita], (error, results) => {
            if (error) {
                console.error('Error al guardar el registro:', error);
                return res.status(500).json({ message: 'Error al insertar los datos en la base de datos' });
            }
            // Si la consulta fue exitosa
            res.status(201).json({ message: 'Registro guardado con éxito' });
        });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ message: 'Hubo un problema en el servidor' });
    }
  });
  
// Endpoint para obtener los datos por el correo específico ventana registro
app.get('/api/registro/:correo', (req, res) => {
    console.log('Params recibidos:', req.params);
    const { correo } = req.params;

    if (!correo) {
        return res.status(400).json({ error: 'Debe proporcionar un correo electrónico' });
    }

    const query = 'SELECT correo, apellidoPaterno, apellidoMaterno, nombre, telefono, alergias, sexo, motivoConsulta, diaCita, horaCita FROM registro WHERE correo = ?';

    connection.query(query, [correo], (err, result) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error al obtener los datos', details: err });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'El correo no fue encontrado' });
        }

        return res.status(200).json(result[0]); // ✅ Asegura que solo se envía una respuesta
    });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// --------------------------------Endpoint para elimanr los datos por el correo específico
app.delete('/api/modificar/eliminar/:correo', (req, res) => {
    const { correo } = req.params;
    if (!correo) {
        return res.status(400).send({ error: 'Debe proporcionar un correo electrónico' });
    }
    const query = 'DELETE FROM registro WHERE correo = ?';
    connection.query(query, [correo], (err, result) => {
        if (err) {
            console.error('Error al eliminar el registro:', err);
            console.error(`Query ejecutada: ${query}`);
            console.error(`Valores proporcionados: ${correo}`);
            return res.status(500).send({ 
                error: 'Error al eliminar los datos de la base de datos', 
                details: err 
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'El correo no fue encontrado en la base de datos' });
        }
        res.status(200).send({ message: 'Registro eliminado con éxito' });
    });
});

// Endpoint para obtener los datos por el correo específico
app.get('/api/modificar/:correo', (req, res) => {
    console.log('Params recibidos:', req.params);
    const { correo } = req.params;
    if (!correo) {
        return res.status(400).json({ error: 'Debe proporcionar un correo electrónico' });
    }
    const query = 'SELECT correo, apellidoPaterno, apellidoMaterno, nombre, telefono, alergias, sexo, motivoConsulta, diaCita, horaCita FROM registro WHERE correo = ?';

    connection.query(query, [correo], (err, result) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error al obtener los datos', details: err });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'El correo no fue encontrado' });
        }
        return res.status(200).json(result[0]); // ✅ Asegura que solo se envía una respuesta
    });
});
// Endpoint para actualizar los datos de un proveedor
app.put('/api/modificar/:correo', (req, res) => {
    console.log('Datos recibidos del método PUT:', req.body);
    const { correo } = req.params;
    const { apellidoPaterno, apellidoMaterno, nombre, telefono, alergias, sexo, motivoConsulta, diaCita, horaCita } = req.body;
    // Validaciones
    if (
        !apellidoPaterno || typeof apellidoPaterno !== 'string' ||
        !apellidoMaterno || typeof apellidoMaterno !== 'string' ||
        !nombre || typeof nombre !== 'string' ||
        !telefono || typeof telefono !== 'string' ||
        !alergias || typeof alergias !== 'string' ||
        !sexo || typeof sexo !== 'string' ||
        !motivoConsulta || typeof motivoConsulta !== 'string' ||
        !diaCita || typeof diaCita !== 'string' ||
        !horaCita || typeof horaCita !== 'string'
    ) {
        return res.status(400).json({ success: false, error: 'Algunos campos son inválidos o están vacíos.' });  }
    // Verificar si el paciente existe antes de actualizar
    const checkQuery = 'SELECT * FROM registro WHERE correo = ?';
    connection.query(checkQuery, [correo], (err, rows) => {
        if (err) {
            console.error('Error al verificar paciente:', err);
            return res.status(500).json({ success: false, error: 'Error al verificar paciente', details: err.message }); }
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'El paciente no fue encontrado' });  }
        // Si el paciente existe, proceder con la actualización
        const updateQuery = `
            UPDATE registro
            SET apellidoPaterno = ?, apellidoMaterno = ?, nombre = ?, telefono = ?, alergias = ?, sexo = ?, motivoConsulta = ?, diaCita = ?, horaCita = ? 
            WHERE correo = ? `;
        const params = [apellidoPaterno, apellidoMaterno, nombre, telefono, alergias, sexo, motivoConsulta, diaCita, horaCita, correo];
        connection.query(updateQuery, params, (err, result) => {
            if (err) {
                console.error('Error en la consulta:', { query: updateQuery, params, err });
                return res.status(500).json({ success: false, error: 'Error al actualizar los datos del paciente', details: err.message });
            }
            res.status(200).json({ success: true, message: 'Paciente actualizado correctamente' });
        });
    });
});


//metodo para obtener datos para que se visualizen en mi tabla  //////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////estraer todos los datos 
app.get('/api/tabla', (req, res) => {
    console.log('Extrayendo todos los datos...');

    const query = 'SELECT correo, apellidoPaterno, apellidoMaterno, nombre, telefono, alergias, sexo, motivoConsulta, diaCita, horaCita FROM registro';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error al obtener los datos', details: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No hay registros en la base de datos' });
        }

        return res.status(201).json(results); // 🔥 Retorna todos los registros en un array
    });
});



// Iniciar el servidor
const PORT = 3000;
app.listen(3000, () => {
    console.log(`Servidor corriendo en http://salud-a-un-click.com:${PORT}`);
});
