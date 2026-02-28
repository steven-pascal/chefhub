const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // 1. Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { name, email, service, message } = req.body;

        // 2. Setup the Gmail Transporter using Environment Variables
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        // 3. Configure the Email Content
        const mailOptions = {
            from: `"${name}" <${process.env.GMAIL_USER}>`, // Best for Gmail delivery
            to: process.env.GMAIL_USER,
            replyTo: email, // So you can click 'Reply' in your inbox
            subject: `Chefhub Inquiry: ${service} from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nService: ${service}\n\nMessage:\n${message}`
        };

        // 4. Send the mail
        await transporter.sendMail(mailOptions);
        
        return res.status(200).json({ message: "Success" });

    } catch (error) {
        console.error('Email Error:', error);
        return res.status(500).json({ error: error.message });
    }
};
