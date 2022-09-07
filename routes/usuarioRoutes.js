import express from "express";
import { 
    registrar, 
    autenticar, 
    confirmar, 
    olvidePassword, 
    comprobarToken,
    nuevoPassword,
    perfil, 
} from "../controllers/usuarioController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

//autenticación, registro y confirmación de usuarios
router.post('/', registrar);//Crea un nuevo usuario
router.post('/login', autenticar);//autenticar usuario
router.get('/confirmar/:token', confirmar);//Ruta para confirmar el token generado aleatoriamente
router.post('/olvide-password', olvidePassword);//Ruta para reestablecer el password
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);//Ruta para comprobar token y reeestablecer password

router.get('/perfil', checkAuth, perfil);


export default router;