import express from "express";
import dotenv from "dotenv"
import conectarDB from "./config/db.js";

const app =express(); //Iniciando el servidor

dotenv.config(); //Buscar las configuraciones del archivo .env

conectarDB(); //Llamar la función para conectar la DB

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});