import mongoose from "mongoose";

// defines un esquema llamado servicesSchema
// Este esquema describe cómo debe ser un documento en la colección Services.
const servicesSchema = mongoose.Schema({
    // Campos del esquema:
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number
    }
})

//  defines un modelo de Mongoose - Services es el nombre del modelo
// Mongoose automáticamente usará la colección services en la base de datos (en minúsculas y plural).
const Services = mongoose.model('Services', servicesSchema)

export default Services
