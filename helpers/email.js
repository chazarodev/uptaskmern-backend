import nodemailer from 'nodemailer';

export const emailRegistro = async (datos) => {
    const {email, nombre, token} = datos;

    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "c8a12f45420ed3",
          pass: "7b258a03b76181"
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