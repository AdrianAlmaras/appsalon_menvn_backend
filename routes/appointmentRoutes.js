import express from 'express';
import { createAppointment, getAppointmentsByDate, getAppointmentById, updateAppointment, deleteAppointment } from '../controllers/appointmentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router()

// authMiddleware forma de validar si el usuario esta autenticado primero
router.route('/')
    .post(authMiddleware, createAppointment)
    .get(authMiddleware, getAppointmentsByDate)

router.route('/:id')
    .get(authMiddleware, getAppointmentById)
    .put(authMiddleware, updateAppointment)
    .delete(authMiddleware, deleteAppointment)

export default router
