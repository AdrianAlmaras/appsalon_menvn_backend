import User from "../models/User.js"
import {  sendEmailVerification, sendEmailPasswordReset  } from '../emails/authEmailService.js'
import { generateJWT, uniqueId } from '../utils/index.js';


const register = async (request, response) => {
    //console.log(request.body)

    // valida todos los campos
    if ( Object.values(request.body).includes('') ) {
        const error = new Error('Todos los campos son obligatorios')
        
        return response.status(400).json({
            msg: error.message
        })
    }

    const { email, password, name } = request.body;
    
    // evitar registros duplicados
    // verificamos si existe con findOne() si existe regresa un obj del registro sino null
    const userExists = await User.findOne( {email: email} ) 
    //console.log(userExists);
    if (  userExists  ) {
        const error = new Error('Ya existe un usuario con ese correo')
        
        return response.status(400).json({
            msg: error.message
        })
    }

    // validar la extensión del password
    const MIN_PASSWORD_LENGTH = 8;
    if(password.trim().length < MIN_PASSWORD_LENGTH) {
        const error = new Error(`El password debe contener ${MIN_PASSWORD_LENGTH} caracteres`);
        
        return response.status(400).json({
            msg: error.message
        })
    }

    try {
        const user = new User(request.body);
        const result = await user.save();
        //console.log(result);
        
        const {name, email, token} = result;
        sendEmailVerification({
            name: name,
            email: email,
            token: token 
        })

        response.json({
            msg: 'El usuario se creo correctamente, revisa tu email'
        })
    } catch (error) {
        console.log(error);
    }
}

const verifyAccount = async(request, response) => {
    //console.log(request.params.token);
    const { token } = request.params;
    const user = await User.findOne( {token:token} )

    //console.log(user);
    if(!user) {
        const error = new Error('Hubo un error, token no válido')
        return response.status(401).json({msg: error.message})
    }
    if(user.verified === true) {
        const error = new Error('La cuenta ya ha sido confirmada')
        return response.status(401).json({msg: error.message})
    }

    // si token valido, confirmar token
    try {
        user.verified = true;
        user.token = '';
        await user.save();
        return response.json({msg: 'Usuario Confirmado Correctamente'})
    } catch (error) {
        console.log(error);
    }
}


const login = async(request, response) => {
    //console.log('desde login');
    const { email, password } = request.body;
    const user = await User.findOne( {email:email} )
    //console.log(email, password);
   // si existe
    if(!user) {
        const error = new Error('El Usuario no existe')
        return response.status(401).json({msg: error.message})
    }

    // si esta autenticado
    if(!user.verified) {
        const error = new Error('Tu cuenta no ha sido confirmado aún')
        return response.status(401).json({msg: error.message})
    }
   
    // comprobar password
    const checkPassword = await user.checkPassword(password);
    //console.log(checkPassword);
    if ( checkPassword ) {
        // generar jwt - aqui o archivo aparte
        const token = generateJWT(user._id)
        //console.log(token);
        return response.json({
            token
        })
    } else {
        const error = new Error('El password es incorrecto')
        return response.status(401).json({msg: error.message})
    }
}

const forgotPassword = async (req, res) => {
    //console.log(req.body);
    const { email } = req.body;

    // Comprobar si existe el usuario
    const user = await User.findOne({email});
    if(!user) {
        const error = new Error('El usuario no existe')
        return res.status(404).json({msg: error.message})
    }
    // si existe generar token nuevo y mandar email
    try {
        user.token = uniqueId();
        const result = await user.save();
        
        await sendEmailPasswordReset({
            name: result.name, 
            email: result.email,
            token: result.token
        });

        res.json({
            msg: "Hemos enviado un email con las instrucciones"
        })
    } catch (error) {
        console.log(erro);
    }
}

const verifyPasswordResetToken = async (req, res) => {
    const { token } = req.params;
    //console.log(token);

    const isValidToken = await User.findOne({token: token})
    if(!isValidToken) {
        const error = new Error('Hubo un error, Token no válido');
        return res.status(400).json({msg: error.message});
    };

    return res.json({msg: 'Token Válido'});

}

const updatePassword = async (req, res) => {
     const { token } = req.params;
    //console.log(token);

    const user = await User.findOne({token: token})
    if(!user) {
        const error = new Error('Hubo un error, Token no válido');
        return res.status(400).json({msg: error.message});
    };
    
    const {password} = req.body;
    //console.log(password);
    try {
        user.token = '';
        user.password = password;
        await user.save()
        res.json({
            msg: 'Password modificado correctamente'
        })
    } catch (error) {
        console.log(error);
    }
}

const user = async (req, res) => {
    //console.log(request.user);
    const { user } = req;

    return res.json(
        user
    );
}

const admin = async (req, res) => {
    //console.log(request.user);
    const { user } = req;
    if(!user.admin) {
        const error = new Error('Accion no válida')
        return res.status(403).json({msg: error.message})
    }
    return res.json(
        user
    );
}
export {
    register,
    verifyAccount,
    login,
    user,
    forgotPassword,
    verifyPasswordResetToken, 
    updatePassword,
    admin
}