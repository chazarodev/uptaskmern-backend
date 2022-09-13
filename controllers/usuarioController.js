import Usuario from "../models/Usuario.js";
import generarID from "../helpers/generarID.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro } from '../helpers/email.js'

//Función para registrar al usuario
const registrar = async (req, res) => {

    //Evitar usuarios duplicados
    const { email } = req.body
    const existeUsuario = await Usuario.findOne({email});

    if (existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }

    try {
        const usuario = new Usuario(req.body);
        usuario.token = generarID();
        await usuario.save(); 

        //ENviar el email de confirmación
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token,
        });

        res.json({msg: 'Usuario registrado correctamente, revisa tu email para confirmar tu cuenta'});
    } catch (error) {
        console.error(error);
    }
}

//Función para autenticar al usuario
const autenticar = async (req, res) => {

    const { email, password } = req.body;

    //Comprobar si el usuario existe
    const usuario = await Usuario.findOne({email});
    if (!usuario) {
        const error = new Error("El usuario no existe");
        return res.status(404).json({msg: error.message});
    }
    
    //Confirmar si está confirmado
    if (!usuario.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({msg: error.message});
    }
    
    //Comprobar su password
    if (await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id),
        })
    } else {
        const error = new Error("Password incorrecto");
        return res.status(403).json({msg: error.message});
    }
}

//Función para confirmar el json web token
const confirmar = async (req, res) => {
    
    const { token } = req.params;
    const usuarioConfirmar = await Usuario.findOne({token});

    //Token invalido
    if (!usuarioConfirmar) {
        const error = new Error("Hubo un error");
        return res.status(403).json({msg: error.message});
    }

    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = "";
        await usuarioConfirmar.save();
        res.json({msg: "Usuario Confirmado Correctamente"});
    } catch (error) {
        console.error(error);
    }

}

//Función para reestablecer el password
const olvidePassword = async (req, res) => {
    const { email } = req.body;

    //Comprobar si el usuario existe
    const usuario = await Usuario.findOne({email});
    if (!usuario) {
        const error = new Error("El usuario no existe");
        return res.status(404).json({msg: error.message});
    }
    
    try {
        usuario.token = generarID();
        await usuario.save();
        res.json({msg: "Hemos enviado un email con las instrucciones para reestableces tu password"});
    } catch (error) {
        console.error(error);
    }
}

//Función para comprobar el token
const comprobarToken = async (req, res) => {
    const { token } = req.params;

    //Verificar que el token exista
    const tokenValido = await Usuario.findOne({ token });
    
    if (tokenValido) {
        res.json({msg: 'Token valido y Usuario existente'});
    } else {
        const error = new Error("Ocurrió un error.");
        return res.status(404).json({msg: error.message});
    }
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    //Verificar que el token exista
    const usuario = await Usuario.findOne({ token });
    
    if (usuario) {
        usuario.password = password;
        usuario.token = '';
        try {
            await usuario.save();
            res.json({msg: 'Password modificado correctamente'});
        } catch (error) {
            console.error(error);
        }
    } else {
        const error = new Error("Ocurrió un error.");
        return res.status(404).json({msg: error.message});
    }
}

const perfil = async (req, res) => {
    const { usuario } = req;

    console.log(usuario);
    res.json(usuario);
}

export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil,
}