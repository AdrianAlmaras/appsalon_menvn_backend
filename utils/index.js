import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'

function validateObjectId(id, response) {
    if( !mongoose.Types.ObjectId.isValid(id) ) {
            const error = new Error('El ID no es válido')
        
        return response.status(400).json({
            msg: error.message
        })
    }
};

function handleNotFoundError(message, response) {
    const error = new Error(message)
       
    return response.status(404).json({
        msg: error.message
    })
};

const uniqueId = () => Date.now().toString(32) + Math.random().toString(32).substring(2);

const generateJWT = (id) => {
    //console.log('desde generateJWT', id);
    // generar token - parametros - payload(datos que quieres agregar en la firma) - key (str que te ayuda a generar el jwt - variable de entorno) - , options (puedes poner la duracion de jwt)
    const token = jwt.sign( { id }, process.env.JWT_SECRET, {
        expiresIn: '30d' // espira en 30 días
    })

    return token
}

function formatDate(date) {
    return format(date, 'PPPP', {locale: es})
}

export {
    validateObjectId,
    handleNotFoundError,
    uniqueId,
    generateJWT,
    formatDate
}