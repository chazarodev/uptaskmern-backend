import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

const agregarTarea = async (req, res) => {
    const { proyecto } = req.body;

    const existeProyecto = await Proyecto.findById(proyecto);

    if (!existeProyecto) {
        const error = new Error('El proyecto no existe');
        return res.status(404).json({msg: error.message});
    }
    
    if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Sin permisos para añadir tareas');
        return res.status(403).json({msg: error.message});
    }
    
    try {
        const tareaAlmacenada = await Tarea.create(req.body);
        //Almacenar el id en el proyecto
        existeProyecto.tareas.push(tareaAlmacenada._id)
        await existeProyecto.save()
        res.json(tareaAlmacenada);
    } catch (error) {
        console.error(error);
    }
}

const obtenerTarea = async (req, res) => {
    const { id } = req.params

    const tarea = await Tarea.findById(id).populate("proyecto");

    if (!tarea) {
        const error = new Error('Tarea no encontrada');
        return res.status(404).json({msg: error.message});
    }
    
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida');
        return res.status(403).json({msg: error.message});
    }

}

const actualizarTarea = async (req, res) => {
    const { id } = req.params

    const tarea = await Tarea.findById(id).populate("proyecto");

    if (!tarea) {
        const error = new Error('Tarea no encontrada');
        return res.status(404).json({msg: error.message});
    }
    
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida');
        return res.status(403).json({msg: error.message});
    }

    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.prioridad = req.body.prioridad || tarea.prioridad;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

    try {
        const tareaAlmacenada = await tarea.save();
        res.json(tareaAlmacenada);
    } catch (error) {
        console.log(error);
    }
}

const eliminarTarea = async (req, res) => {
    const { id } = req.params

    const tarea = await Tarea.findById(id).populate("proyecto");

    if (!tarea) {
        const error = new Error('Tarea no encontrada');
        return res.status(404).json({msg: error.message});
    }
    
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Acción no válida');
        return res.status(403).json({msg: error.message});
    }

    try {
        const proyecto = await Proyecto.findById(tarea.proyecto)
        proyecto.tareas.pull(tarea._id)
        await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()])
        res.json({msg: "Tarea eliminada exitosamente"});
    } catch (error) {
        console.error(error);
    }
}

const cambiarEstado = async (req, res) => {
    const { id } = req.params

    const tarea = await Tarea.findById(id).populate("proyecto");

    if (!tarea) {
        const error = new Error('Tarea no encontrada');
        return res.status(404).json({msg: error.message});
    }

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString() &&  !tarea.proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())) {
        const error = new Error('Acción no válida');
        return res.status(403).json({msg: error.message});
    }

    tarea.estado = !tarea.estado;
    tarea.completado = req.usuario._id; //Valdiar cuál usuario completó la tarea?
    tarea.populate("completado");//Extraer la informaciíon del nombre de usuario que completó la tarea
    await tarea.save();
    res.json(tarea);
}

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado,
}