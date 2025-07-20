//import { request } from "express"
// import mongoose from "mongoose";
// import { services } from "../data/beutyServices.js";
import Services from '../models/Services.js';
import { validateObjectId, handleNotFoundError } from '../utils/index.js'

// crear servicios - asociar a endpoint
const createService = async (request, response) => {
     //console.log(request.body)
    if( Object.values(request.body).includes('') ) {
        const error = new Error('Todos los campos son obligatorios')
        
        return response.status(400).json({
            msg: error.message
        })
    }
    //console.log('hola')
    //response.send('hola')
    try {
        // se crea la instancia, pero aun no se guarda en la db
        const service = new Services(request.body);
         //console.log(service);
        
         //guardar en la bd
        //const result = await service.save();
        await service.save();

        //response.json(result);
        response.json({
            msg: 'El Servicio se creo correctamente.'
        })
    } catch (error) {
        console.log(error);
    }
    
    
}

// listar servicios
const getServices = async (request, response) => {
    //response.json(services)
    try {
        const services = await Services.find();
        response.json(services);
    } catch (error) {
        console.log(error);
    }
}

// traer servicio 
const getServiceById = async (request, response) => {
    //console.log(request.params.id); // accediendo al id
    const { id } = request.params;
    
    // validar un object id
    if ( validateObjectId(id, response) ) return
    // if( !mongoose.Types.ObjectId.isValid(id) ) {
    //      const error = new Error('El ID no es válido')
        
    //     return response.status(400).json({
    //         msg: error.message
    //     })
    // }
    
    // validar que exista en la bd
    const service = await Services.findById(id)
    //console.log(service);

    if( !service ) {
        return handleNotFoundError('El Servicio no existe', response) 
    //     const error = new Error('El Servicio no existe')
       
    //    return response.status(404).json({
    //        msg: error.message
    //    })
   }

    // mostrar el servicio
    response.json(service)
}

const updateService = async (request, response) => {
    //console.log('updateService');

    const { id } = request.params;

    // validar un object id
    if ( validateObjectId(id, response) ) return

    // validar que exista en la bd
    const service = await Services.findById(id);

    if( !service ) {
        return handleNotFoundError('El Servicio no existe', response) 
    }

    // console.log(id);
    // console.log(service);
    // console.log(request.body);

    // actualizar
    service.name = request.body.name || service.name;
    service.price = request.body.price || service.price;

    // guardamos cambios
    try {
        await service.save()
        response.json({
            msg: 'El servicio se actualizó correctamente'
        });
    } catch (error) {
        console.log(error);
    }

    //response.send('update');
}


const deleteService = async (request, response) => {

    const { id } = request.params;

    // validar un object id
    if ( validateObjectId(id, response) ) return

    // validar que exista en la bd
    const service = await Services.findById(id);

    if( !service ) {
         return handleNotFoundError('El Servicio no existe', response) 
    }

    // eliminar servicio
    try {
        await service.deleteOne()
        response.json({
            msg: 'El servicio se eliminó correctamente'
        });
    } catch (error) {
        console.log(error);
    }

    //response.send('update');
}

export {
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService
}

