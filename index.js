import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js"
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js"

const app = express(); //Iniciando el servidor
app.use(express.json());//Procesar la infromación de tipo JSON

dotenv.config(); //Buscar las configuraciones del archivo .env

conectarDB(); //Llamar la función para conectar la DB

//Configurar Cors
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Error de cors'));
        }
    }
}

app.use(cors(corsOptions));

//Routing
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);

const PORT = process.env.PORT || 4000;

const servidor = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

//Socket.io
import {Server} from 'socket.io'

const io = new Server(servidor, {
    pingTimeout: 6000,
    cors: {
        origin: process.env.FRONTEND_URL,
    },
});

io.on('connection', (socket) => {
    // console.log('Conectado a socket.io');

    // Definir los eventos de socket.io
    // socket.on('prueba', () => {
    //     console.log('Putos');
    //     socket.emit('respuesta');
    // })

    socket.on('abrir proyecto', (proyecto) => {
        socket.join(proyecto);
    })

    socket.on('nueva tarea', tarea => {
        const proyecto = tarea.proyecto;
        socket.to(proyecto).emit('tarea agregada', tarea); //En lugar de .on utilizamos .to para evitar el error en el servidor
    })

    socket.on('eliminar tarea', tarea => {
        const proyecto = tarea.proyecto;
        socket.to(proyecto).emit('tarea eliminada', tarea);
    })

    socket.on('actualizar tarea', tarea => {
        const proyecto = tarea.proyecto._id;
        socket.to(proyecto).emit('tarea actualizada', tarea);
    })
    
    socket.on('cambiar estado', tarea => {
        const proyecto = tarea.proyecto._id;
        socket.to(proyecto).emit('nuevo estado', tarea);
    })
})