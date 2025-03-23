import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST,
    port: parseInt(process.env.ZOHO_SMTP_PORT),
    secure: process.env.ZOHO_SMTP_SECURE === 'true',
    auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD,
    },
});

const transporter2 = nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST,
    port: parseInt(process.env.ZOHO_SMTP_PORT),
    secure: process.env.ZOHO_SMTP_SECURE === 'true',
    auth: {
        user: process.env.ZOHO_EMAIL2,
        pass: process.env.ZOHO_PASSWORD,
    },
});

export const sendMail = async (to, subject, content, isHTML = true, useSecondary = false) => {
    const mailOptions = {
        from: `"ekalooms" <${useSecondary ? process.env.ZOHO_EMAIL2 : process.env.ZOHO_EMAIL}>`,
        to,
        subject,
        [isHTML ? 'html' : 'text']: content,
    };

    const transporterToUse = useSecondary ? transporter2 : transporter;
    await transporterToUse.sendMail(mailOptions);
};
