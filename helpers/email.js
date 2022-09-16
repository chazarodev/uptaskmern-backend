import nodemailer from 'nodemailer';

export const emailRegistro = async (datos) => {
    const {email, nombre, token} = datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    //Información del email
    const info = await transport.sendMail({
        from: '"Uptask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "Uptask - Confirma tu cuenta",
        text: 'Confirma tu cuenta en UpTask',
        html: `<p>Hola: ${nombre} comprueba tu cuenta en Uptask</P>
        <p>Tu cuenta ya está casi lista, solo debes comprobarla en el siguiente enlace: 
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a>
        </p>
        <p>Si tu no creaste está cuenta puedes ignorar este mensaje</p>
        `
    });
}

export const emailOlvidePassword = async (datos) => {
    const {email, nombre, token} = datos;

    //TODO: Realizar variables de entorno
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    //Información del email
    const info = await transport.sendMail({
        from: '"Uptask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "Uptask - Reestablece tu password",
        text: 'Reestablece el password de tu cuenta en UpTask',
        html: `<p>Hola: ${nombre} has solicitado reestablecer tu password</P>
        <p>Genera un nuevo password en el siguiente enlace: 
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
        </p>
        <p>Si tu no solicitaste este email puedes ignorar este mensaje</p>
        `
    });
}