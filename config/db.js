import mongoose from 'mongoose';
import colors from 'colors';

// conexión a la base de datos
export const db = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        //console.log(db.connection);
        const url = `${db.connection.host}:${db.connection.port}`;
        console.log( colors.yellow('MongoDB se conectó correctomente:', url) );
    }
     catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1); // detener la ejecución o detener nuestro programa
        // hay diferentes formas de cerrar un programa 0 , 1 si hay un error
    }

}
