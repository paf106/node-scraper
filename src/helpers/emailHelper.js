// let nodemailer = require('nodemailer');
import nodemailer from 'nodemailer';

import { EMAIL_KEY_PABLO } from './Constants.js'

export const sendEmail = (asunto, mensaje) => {
    let destinatario = "pabloavila106@gmail.com";

    let mailOptions = {
        from: 'Información administración',
        to: destinatario,
        subject: asunto,
        html: mensaje
    };

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: destinatario,
            pass: EMAIL_KEY_PABLO
        }
    });

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            console.log("No se ha podido enviar el email")
        } else {
            console.log("Email enviado")
        }
    })
}