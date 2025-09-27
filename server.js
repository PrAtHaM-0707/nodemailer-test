const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Log environment variables (mask password for security)
console.log('Environment variables:');
console.log('GMAIL_USER:', process.env.GMAIL_USER ? 'Set' : 'Not set');
console.log('GMAIL_PASS:', process.env.GMAIL_PASS ? 'Set (length: ' + process.env.GMAIL_PASS.length + ')' : 'Not set');

app.use(bodyParser.json());
app.use(cors({
  origin: ['http://localhost:3000', 'https://nodemailer-test-seven.vercel.app']
}));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });
  } else {
    console.log('SMTP connection verified successfully');
  }
});

app.post('/send-email', async (req, res) => {
  const { email } = req.body;

  console.log('Received email request:', { email });

  if (!email || !email.includes('@gmail.com')) {
    console.log('Invalid email:', email);
    return res.status(400).json({ error: 'Please provide a valid Gmail address.' });
  }

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Welcome to Our Platform!',
    text: 'Hello! Thank you for logging in. This is your welcome email.',
    html: '<h1>Welcome!</h1><p>Thank you for logging in. This is your welcome email.</p>'
  };

  try {
    console.log('Attempting to send email to:', email);
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', email);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});