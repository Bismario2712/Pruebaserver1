// importar las librerias
import express, { json } from "express";
import mysql from "mysql2";
import {number, string, z} from "zod";

// app

const app = express()
const port = 1234;

app.use(express.static('public'));
app.use(express.json());


//configuracion a la base de datos
const db = mysql.createConnection({
 host:'localhost',
 user: 'root',
 password: 'root',
 database: 'superMercado'

})

db.connect(err => {
    if (err) {
        console.error("Error al conectar a la base de datos: " + err);
        return;
    }
    console.info("Conexión exitosa");

    const articulosSchema = z.object({
        nombre: z.string().min(1),
        descripcion: z.string().optional(),
        precio: z.number().nonnegative(),
        cantidad: z.number().int().nonnegative(),
        categoria: z.string().optional(),
        imagen: z.string().url().optional()
    });


});
//rutas para encontrar la API

app.get('/articulos', (req, res) => {
    db.query('select * from articulos;', (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message});
        }
        res.json(result)
    })
});
app.get('/articulos/buscar', (req, res) => {
    const { nombre, categoria } = req.query;

    let consulta = 'SELECT * FROM articulos WHERE 1=1'; 
    const params = [];

    if (nombre) {
        consulta += ' AND nombre LIKE ?'; 
        params.push(`%${nombre}%`); 
    }

    if (categoria) {
        consulta += ' AND categoria = ?';
        params.push(categoria); 
    }

    console.log("Consulta SQL:", consulta);
    console.log("Parámetros:", params);

    db.query(consulta, params, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});


// app.post()
// app.delete()
// app.put()

app.listen(port, () => {
console.info('servidor corriendo por el http: localhost' + port)
})

