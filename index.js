// las dependencias no ocupan el .js al final
// configuracion de nuestro server express
// const express = require('express'); common js
import express from 'express'; // sintaxis ESM
import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors'
import {db} from './config/db.js';
import servicesRoutes from './routes/servicesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import userRoutes from './routes/userRoutes.js'

// obtener variables de entorno
dotenv.config(); // se puede pasar la ubicacion pero como estan en la misma carpeta, solo se necesita mandar a llamar

// configurar la app
const app = express();

// leer datos via body - le decimos que queremos habilitar el recibir datos 
app.use(express.json())

// conectar a db
db();


// configurar cors
//console.log(process.argv);

const whitelist = process.argv[2] === '--postman' ? [process.env.FRONTEND_URL, undefined] : [process.env.FRONTEND_URL] // dominios permitidos
// como el origen es undefined en postman lo habilitamos
const corsOptions = {
    origin: function(origin, callback) {
        console.log('Origin:', origin);  // http://localhost:5173
        if(whitelist.includes(origin)) {
            // permitir conexion
            callback(null, true)
        } else {
            // denegar conexion
             callback( new Error('Error de CORS') )
        }
    }
}
app.use(cors(corsOptions))

// lista blanca 

// lista de dominios permitidos

//opciones de cors y configurar cors

// definir una ruta
// en el callback se pasan almenos 2 parametros escenciales
// request info de la peticion que se esta realizando hacia la url, navegador que utilizas o si llenas un formulario
// response es la respuesta que te da express una vez que procesa lo que tu le estas enviando
// puedes responder con una consulta a la bd, un msj de que algo se envio correctamente, etc, tu puedes construir tus propias respuestas
// app.get('/', (request, response) => {
//     const product = [
//         {
//             id: 1,
//             price: 30,
//             name: 'Laptop'
//         },   
//         {
//             id: 1,
//             price: 30,
//             name: 'Laptop'
//         }  
//     ]
    

//     // send siempre renderiza un str
//     // response.send(product);
//     response.json(product); // tambien lo convierte a json
// });

// use abarca las diferentes peticiones http
// ante cualquier peticion http hacia diagonal services
app.use('/api/services', servicesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);

// definir puerto
// asi se accede a una var de entorno en express
const PORT = process.env.PORT || 4000;

// arrancar la app
app.listen(PORT, () => {
    console.log( colors.blue('El servidor se esta ejecutando en el puerto:', colors.bold(PORT)) );
})


