const nodemailer = require('nodemailer');

const sendEmail = async options =>{

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: "Test Acc <ta0373417@gmail.com>",
        to: options.email,
        subject: options.subject,
        text:options.message ,
    }

    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;