const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { name, email, service, message } = JSON.parse(event.body);

    // 1. Setup the Gmail Transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER, // Your gmail
            pass: process.env.GMAIL_APP_PASSWORD // Your 16-character App Password
        }
    });

    // 2. Configure the Email Content
    const mailOptions = {
        from: email,
        to: process.env.GMAIL_USER,
        subject: `Chefhub Inquiry: ${service} from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nService: ${service}\n\nMessage:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Success" })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};