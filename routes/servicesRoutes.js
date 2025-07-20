import express from 'express';
//import { services } from '../data/beutyServices.js'
import { createService, getServices, getServiceById, updateService, deleteService } from '../controllers/servicesController.js';

const router = express.Router();


// router.get('/', (request, response) => {
    

//     // send siempre renderiza un str
//     // response.send(product);
//     response.json(services); // tambien lo convierte a json
// });

//router.post('/', createService);
//router.get('/', getServices); // no se manda a llamar getServices() porque no se ejecuta .get()

router.route('/')
    .post( createService )
    .get( getServices )

router.route('/:id')
    .get( getServiceById )
    .put( updateService )
    .delete( deleteService ) 

//router.get('/:id', getServiceById);
//router.put('/:id', updateService);
//router.delete('/:id', deleteService);

// simplificando las rutas

export default router

