//const nodemailer = require("nodemailer");
import nodemailer from 'nodemailer'


// Create a test account or replace with real credentials.
export function createTransport(host, port, user, pass) {
    
    const transporter = nodemailer.createTransport({
        host: host, //"sandbox.smtp.mailtrap.io",
        port: port,//587,
        auth: {
            user: user,//"4fdac14abc2ea8",
            pass: pass,//"b2d3994d340acd",
        },
  });
  
  return transporter
}


