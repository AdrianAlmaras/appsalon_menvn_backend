import { createTransport } from '../config/nodemailer.js';

export async function sendEmailNewAppointment( {date, time} ) {
    const transporter = createTransport(
            process.env.EMAIL_HOST,
            process.env.EMAIL_PORT,
            process.env.EMAIL_USER,
            process.env.EMAIL_PASS
    )

    await transporter.verify();
    console.log("Server is ready to take our messages");
    // Enviar el email  front http://localhost:5173/auth/confirmar-cuenta/ - back - http://localhost:4000/api/auth/verify/
    const info = await transporter.sendMail({
        from: 'AppSalon <citas@appsalon.com>',
        to: 'admin@appsalon.com',
        subject: "AppSalon - Nueva Cita",
        text: "AppSalon - Nueva Cita",
        html: `<p>Hola Admin, tiene una nueva cita</p>
        <p>La cita será el día: ${date} a las ${time} horas.</p>
        `
    });

    console.log('Mensaje enviado', info.messageId);
}


export async function sendEmailUpdateAppointment( {date, time} ) {
    const transporter = createTransport(
            process.env.EMAIL_HOST,
            process.env.EMAIL_PORT,
            process.env.EMAIL_USER,
            process.env.EMAIL_PASS
    )

    await transporter.verify();
    console.log("Server is ready to take our messages");
    // Enviar el email  front http://localhost:5173/auth/confirmar-cuenta/ - back - http://localhost:4000/api/auth/verify/
    const info = await transporter.sendMail({
        from: 'AppSalon <citas@appsalon.com>',
        to: 'admin@appsalon.com',
        subject: "AppSalon - Cita Actualizada",
        text: "AppSalon - Cita Actualizada",
        html: `<p>Hola Admin, un usuario ha modificado una cita.</p>
        <p>La nueva cita será el día: ${date} a las ${time} horas.</p>
        `
    });

    console.log('Mensaje enviado', info.messageId);
}


export async function sendEmailCancelAppointment( {date, time} ) {
    const transporter = createTransport(
            process.env.EMAIL_HOST,
            process.env.EMAIL_PORT,
            process.env.EMAIL_USER,
            process.env.EMAIL_PASS
    )

    await transporter.verify();
    console.log("Server is ready to take our messages");
    // Enviar el email  front http://localhost:5173/auth/confirmar-cuenta/ - back - http://localhost:4000/api/auth/verify/
    const info = await transporter.sendMail({
        from: 'AppSalon <citas@appsalon.com>',
        to: 'admin@appsalon.com',
        subject: "AppSalon - Cita Cancelada",
        text: "AppSalon - Cita Cancelada",
        html: `<p>Hola Admin, un usuario ha cancelado una cita.</p>
        <p>La cita estaba programada para: ${date} a las ${time} horas.</p>
        `
    });

    console.log('Mensaje enviado', info.messageId);
}