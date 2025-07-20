import express from 'express'
import { register, verifyAccount, login, user, forgotPassword, updatePassword, verifyPasswordResetToken, admin } from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router()

// Rutas de autenticacion y registro de user
router.post('/register', register);
router.get('/verify/:token', verifyAccount);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

router.route('/forgot-password/:token')
    .get(verifyPasswordResetToken)
    .post(updatePassword)


// Area Privada - Requiere un JWT
// una vez que se mande a llamar el endpoint va y ejecuta nuestra función y termina va a user 
// protegemos nuestras rutas del frontend con jwt y si es valido obtenemos la sesion del usuario
router.get('/user', authMiddleware, user);
router.get('/admin', authMiddleware, admin);


export default router


