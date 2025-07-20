// este seeder no tiene nada que ver o no esta integrado, digamos a nuestro código de nuestra rest api, por lo tanto, requerimos importar
// la configuracion de la base de datos para conectarnos, ingresar los datos y finalizar el código.
import dotenv from 'dotenv';
import colors from 'colors';
import {  db  } from '../config/db.js';
import Services from '../models/Services.js';
import { services  } from './beutyServices.js'

dotenv.config();

await db();

async function seedDB() {
    try {
        await Services.insertMany(services);
        console.log(colors.green.bold('Se agregaron los datos correctamente'));
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }

    //console.log('desde seedDB');
}


async function clearDB() {
    try {
        await Services.deleteMany();
        console.log(colors.red.bold('Se eliminaron los datos correctamente'));
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}


// console.log( process.argv ); // acceder a los comandos - nos dice que estamos ejecutando aqui:  "seed:import": "node data/seed.js"
if(process.argv[2] === '--import') {
    seedDB()
} else {
    clearDB()
}
