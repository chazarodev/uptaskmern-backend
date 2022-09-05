import mongoose from "mongoose";

//Definir el esquema (Estructura de la base de datos)
const usuarioSchema = mongoose.Schema({
    nombre: {
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
    },
    token: {
        type: String
    },
    confirmado: {
        type: Boolean,
        default: false,
    },
}, {
    timeStamps: true //Nos genera dos columnas más, una de creado y otra de actualizado
})

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;