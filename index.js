import express from "express";
import dotenv from "dotenv"
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js"

const app = express(); //Iniciando el servidor
app.use(express.json());//Procesar la infromación de tipo JSON

dotenv.config(); //Buscar las configuraciones del archivo .env

conectarDB(); //Llamar la función para conectar la DB

//Routing
app.use("/api/usuarios", usuarioRoutes)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});