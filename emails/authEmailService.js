import { createTransport } from '../config/nodemailer.js';


export async function sendEmailVerification({name, email, token}) {
    //console.log('desde sendEmailVerification');
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS
    )
    //console.log(transporter);
    await transporter.verify();
    console.log("Server is ready to take our messages");
    // Enviar el email  front http://localhost:5173/auth/confirmar-cuenta/ - back - http://localhost:4000/api/auth/verify/
    const info = await transporter.sendMail({
        from: 'AppSalon <cuentas@appsalon.com>',
        to: email,
        subject: "AppSalon - Confirma tu cuenta",
        text: "AppSalon - Confirma tu cuenta",
        html: `<p>Hola ${name}, confirma tu cuenta en AppSalon</p>
        <p>Tu cuenta esta casi lista, solo debes confirmarla en el siguiente enlace</p>
        <a href="${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}">Confirma tu cuenta</a>
        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    });

    console.log('Mensaje enviado', info.messageId);
}


export async function sendEmailPasswordReset({name, email, token}) {
    //console.log('desde sendEmailVerification');
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS
    )
    //console.log(transporter);
    await transporter.verify();
    console.log("Server is ready to take our messages");
    // Enviar el email  front http://localhost:5173/auth/confirmar-cuenta/ - back - http://localhost:4000/api/auth/verify/
    const info = await transporter.sendMail({
        from: 'AppSalon <cuentas@appsalon.com>',
        to: email,
        subject: "Restablece tu password",
        text: "Restablece tu password",
        html: `<p>Hola ${name}, ha solicitado reestablecer tu password</p>
        <p>Sigue el siguiente enlace para generar un nuevo password:</p>
        <a href="${process.env.FRONTEND_URL}/auth/olvide-password/${token}">Reestablecer Password</a>
        <p>Si tu no solicitaste esto, puedes ignorar este mensaje</p>
        `
    });

    console.log('Mensaje enviado', info.messageId);
}

