import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import {  uniqueId  } from '../utils/index.js';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    token: {
        type: String,
        default: uniqueId // valor por default mandar a llamr uniqueId
    },
    verified: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    }
});

/*
Un middleware en Mongoose (y también en Express, etc.) es una función que se ejecuta automáticamente en cierto punto del ciclo de vida de un documento.

En Mongoose, hay middleware pre y post para operaciones como:

.save() (guardar)

.validate() (validación)

.remove() (eliminar)

.update() (actualizar)

Te permiten intervenir antes o después de que Mongoose haga algo.

 ¿Qué es un hook?
"Hook" es básicamente sinónimo de "middleware" en este contexto, aunque el término hook se refiere más a la acción que dispara el middleware.

🔁 Ejemplo:

Hook: "save" (guardar el documento)

Middleware: función que se ejecuta cuando se dispara ese hook


¿Qué hace next()?
next() es una función que Mongoose proporciona automáticamente al middleware, y se usa para decirle:

“Ya terminé aquí, puedes seguir con lo que sigue.”

📌 Si no llamas a next(), el proceso se queda atorado y nunca termina (salvo que uses async/await correctamente y no necesites next, como veremos abajo).
*/



// pre('save') es un hook que se ejecuta antes de que se ejecute .save() - sirve para ejecutar código automáticamente antes de que un documento se guarde en la base de datos
// Si la contraseña fue modificada, la convierte a un hash seguro usando bcrypt.
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        return next()  // Si el campo 'password' no ha sido modificado, pasa al siguiente paso
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash( this.password, salt );
    next(); //  función que Mongoose proporciona automáticamente al middleware, y se usa para decirle: “Ya terminé aquí, puedes seguir con lo que sigue.”
})

// Compara una contraseña ingresada con la almacenada hasheada.
// Devuelve true si coinciden.
userSchema.methods.checkPassword = async function(inputPassword) {
    return await bcrypt.compare(inputPassword, this.password)
}


const User = mongoose.model('User', userSchema);

export default User

