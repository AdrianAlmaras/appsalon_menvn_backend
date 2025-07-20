import Appointment from "../models/Appointment.js";
import { parse, formatISO, startOfDay, endOfDay, isValid } from 'date-fns';
import { validateObjectId, handleNotFoundError, formatDate } from '../utils/index.js'
import { sendEmailNewAppointment, sendEmailUpdateAppointment, sendEmailCancelAppointment } from "../emails/appointmentEmailService.js";


const createAppointment = async (request, response) => {
    const appointment = request.body
    appointment.user = request.user._id.toString();
    //console.log(appointment);
    // console.log(request.body);
    //console.log(request.user);
    
    try {
        const newAppointment = new Appointment(appointment)
        const result = await newAppointment.save()

        await sendEmailNewAppointment({
            date: formatDate(result.date),
            time: result.time
        })

        response.json({
            msg: 'Tu reservación se realizó correctamente'
        })

    } catch (error) {
        console.log(error);
    }

}

const getAppointmentsByDate = async ( request , response) => {
    
    // obtenemos la fecha y la formateamos a iso
    //console.log(request.query.date);
    const { date } = request.query;
    //console.log(date);
    
    const newDate = parse(date, 'dd/MM/yyyy', new Date()); 
    //console.log(newDate);

    if ( !isValid(newDate) ) {
        const error = new Error('Fecha no válida')

        return response.status(400).json({
            msg: error.message
        })
    }

    //console.log(formatISO(newDate)); // formato iso
    const isoDate = formatISO(newDate);
    // console.log(isoDate);
    // console.log( new Date (isoDate) );

    // filtramos por fecha desde el incio del dia hasta el fin del dia sin importar el uso horario que este usando mongo
    const appointments = await Appointment.find({
        date: {
            $gte: startOfDay( new Date(isoDate) ),
            $lte: endOfDay( new Date(isoDate) ),
        }
    }).select('time');

    response.json(appointments)

}

const getAppointmentById = async(req, res) => {
    // valildar que el usuario que hace la peticion vea la cita correspondiente

    //console.log('desde getAppointmentById');
    //console.log(req.params.id);
    const { id } = req.params;

    // validar por object id
    if( validateObjectId(id, res) ) return

    // validar que exista 
    const appointment = await Appointment.findById(id).populate('services')
    if(!appointment) {
        return handleNotFoundError('La cita no existe', res)
    }

    // validando que la cita sea del usuario quien esta mandando la peticion
    if (appointment.user.toString() !== req.user._id.toString() ) {
        const error = new Error('No tienes los permisos')

        return response.status(403).json({
            msg: error.message
        })
    }

    // retornar la cita
    res.json(appointment)
} 

const updateAppointment = async (req, res) => {
    const { id } = req.params;

    // validar por object id
    if( validateObjectId(id, res) ) return

    // validar que exista 
    const appointment = await Appointment.findById(id).populate('services')
    if(!appointment) {
        return handleNotFoundError('La cita no existe', res)
    }

    // validando que la cita sea del usuario quien esta mandando la peticion
    if (appointment.user.toString() !== req.user._id.toString() ) {
        const error = new Error('No tienes los permisos')

        return response.status(403).json({
            msg: error.message
        })
    }

    // actualizar
    const { date, time, totalAmount, services } = req.body;
    appointment.date = date;
    appointment.time = time;
    appointment.totalAmount = totalAmount;
    appointment.services = services;

    try {
        const result = await appointment.save();
        
        await sendEmailUpdateAppointment({
            date: formatDate(result.date),
            time: result.time
        })

        res.json({
            msg: 'Cita Actualizada Correctamente'
        })
    } catch (error) {
        console.log(error)
    }

}

const deleteAppointment = async (req, res) => {
    const { id } = req.params;

    // validar por object id
    if( validateObjectId(id, res) ) return

    // validar que exista 
    const appointment = await Appointment.findById(id).populate('services')
    if(!appointment) {
        return handleNotFoundError('La cita no existe', res)
    }

    // validando que la cita sea del usuario quien esta mandando la peticion
    if (appointment.user.toString() !== req.user._id.toString() ) {
        const error = new Error('No tienes los permisos')

        return response.status(403).json({
            msg: error.message
        })
    }

    try {
        const result = await appointment.deleteOne()
        await sendEmailCancelAppointment({
            date: formatDate(appointment.date),
            time: appointment.time
        })

        res.json( {msg: 'Cita Cancelada Exitosamente'} )
        
    } catch (error) {
        console.log(error)
    }
}

export {
    createAppointment,
    getAppointmentsByDate,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
}
