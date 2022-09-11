import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

//Función para obtener los proyectos
const obtenerProyectos = async (req, res) => {
    const proyectos = await Proyecto.find().where('creador').equals(req.usuario);//req.usuario viene de checkAuth.js
    res.json(proyectos);
}

//Función para crear un nuevo proyecto
const nuevoProyecto = async (req, res) => {
    const proyecto = new Proyecto(req.body);
    proyecto.creador = req.usuario._id;

    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.error(error);
    }
}

//Función para consultar un proyecto en específico
const obtenerProyecto = async (req, res) => {
    const { id } = req.params;

    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({msg: error.message});
    }
    
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Sin permisos para consultar este proyecto")
        return res.status(401).json({msg: error.message});
    }

    //Obtener las tareas del proyecto
    const tareas = await Tarea.find().where("proyecto").equals(proyecto._id);

    res.json({
        proyecto,
        tareas,
    });
}

//Función para editar un proyecto
const editarProyecto = async (req, res) => {
    const { id } = req.params;
    
    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({msg: error.message});
    }
    
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Sin permisos para consultar este proyecto")
        return res.status(401).json({msg: error.message});
    }

    //Editar los valores, si no se modificaron, quedan los mismos de la DB
    proyecto.nombre  = req.body.nombre || proyecto.nombre;
    proyecto.descripcion  = req.body.descripcion || proyecto.descripcion;
    proyecto.fechaEntrega  = req.body.fechaEntrega || proyecto.fechaEntrega;
    proyecto.cliente  = req.body.cliente || proyecto.cliente;

    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.error(error);
    }
}

const eliminarProyecto = async (req, res) => {
    const { id } = req.params;
    
    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({msg: error.message});
    }
    
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Sin permisos para consultar este proyecto")
        return res.status(401).json({msg: error.message});
    }

    try {
        await proyecto.deleteOne();
        res.json({ msg: "Proyecto Eliminado"});
    } catch (error) {
        console.error(error);
    }
}

const agregarColaborador = async (req, res) => {

}

const eliminarColaborador = async (req, res) => {

}

export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
}

