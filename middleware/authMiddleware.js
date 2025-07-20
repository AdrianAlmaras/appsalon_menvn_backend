import jwt from 'jsonwebtoken';
import user from '../models/User.js';
import User from '../models/User.js';

// forma de agregar una capa para que el usuario no pueda acceder a user
const authMiddleware = async (request, response, next) => {
    // tomar jwt validarlo 
    //console.log(request.headers.authorization);
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer') ) {
        try {
            //console.log(request.headers.authorization)
            const token = request.headers.authorization.split(' ')[1];
            //le pasamos el token y usamos nuestra secret key para decodificar (verificar token)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //console.log(decoded);
            request.user = await User.findById(decoded.id).select(
                "-password -verified -token -__v",
            );
            //console.log(user);
            next();
        }
        catch {
            const error = new Error('Token no válido');
            response.status(403).json( {msg: error.message} );
        }

    } else {
        //console.log('No hay token')
        const error = new Error('Token no válido o inexistente');
        response.status(403).json( {msg: error.message} );
    }

    // para decirle a express ya termine, ejecuta el sig middleware user
    //next()
}


export default authMiddleware

