import { response } from "express";
import Appointment from "../models/Appointment.js";


const getUserAppointments = async (request, response) => {
    const { user } = request.params;

    // console.log( typeof(user) ); // id del usuario 
    // console.log( typeof( request.user._id.toString() ) ); // id del token recibido en autenticacion
    //const role = 'user'
    if( user !== request.user._id.toString()  ) {
        const error = new Error('Acceso Denegado')
        return response.status(400).json({ msg: error.message })
    }

    try {
        const query = request.user.admin ? { date: { $gte: new Date() } } : { user, date: { $gte: new Date() } };
        
        const appointments = await Appointment
                                    .find( query )
                                    .populate('services')
                                    .populate({path: 'user', select: 'name email '})
                                    .sort({date: 'asc'})
        //console.log(appointments);
        return response.json(appointments)

    } catch (error) {
        console.log(error)
    }

}

export {
    getUserAppointments,
}

