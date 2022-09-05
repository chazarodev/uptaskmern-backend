import express from "express";
import { registrar, autenticar, confirmar } from "../controllers/usuarioController.js"

const router = express.Router();

//autenticación, registro y confirmación de usuarios
router.post('/', registrar);//Crea un nuevo usuario
router.post('/login', autenticar);//autenticar usuario
router.get('/confirmar/:token', confirmar);


export default router;