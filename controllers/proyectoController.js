import Proyecto from "../models/Proyecto.js";
import Usuario from "../models/Usuario.js";

//Función para obtener los proyectos
const obtenerProyectos = async (req, res) => {
    //req.usuario viene de checkAuth.js
    const proyectos = await Proyecto.find().where('creador').equals(req.usuario).select('-tareas');
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

    //Obtener el proyecto con sus tareas
    const proyecto = await Proyecto.findById(id).populate('tareas')

    if (!proyecto) {
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({msg: error.message});
    }
    
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Sin permisos para consultar este proyecto")
        return res.status(401).json({msg: error.message});
    }

    //Obtener las tareas del proyecto
    // const tareas = await Tarea.find().where("proyecto").equals(proyecto._id);

    res.json(proyecto);
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

const buscarColaborador = async (req, res) => {
    const { email } = req.body;

    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v');

    if (!usuario) {
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({msg: error.message});
    }
    res.json(usuario);
}

const agregarColaborador = async (req, res) => {
    const proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
        const error = new Error("Proyecto no Encontrado");
        return res.status(404).json({msg: error.message})
    }
    
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no válida");
        return res.status(404).json({msg: error.message})
    }

    const { email } = req.body;

    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v');

    if (!usuario) {
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({msg: error.message});
    }
    
    //El colaborador no es el admin
    if (proyecto.creador.toString() === usuario._id.toString()) {
        const error = new Error('El creador del proyecto no puede ser colaborador');
        return res.status(404).json({msg: error.message});
    }
    
    //REvisar que el colaborador no haya sido ya agregado
    if (proyecto.colaboradores.includes(usuario._id)) {
        const error = new Error('Este usuario ya pertenece al proyecto');
        return res.status(404).json({msg: error.message});
    }

    //Después de las comprobaciones, podemos agregar al colaborador
    proyecto.colaboradores.push(usuario._id);
    await proyecto.save();
    res.json({msg: "Colaborador agregado correctamente"});

}

const eliminarColaborador = async (req, res) => {

}

export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador,
}

