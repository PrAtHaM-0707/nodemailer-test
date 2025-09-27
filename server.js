const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;  // Use environment PORT for production

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve the HTML form
app.use(express.static('public'));

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_PASS  // Your Gmail App Password
  }
});

// Route to handle email sending
app.post('/send-email', async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email || !email.includes('@gmail.com')) {
    return res.status(400).json({ error: 'Please provide a valid Gmail address.' });
  }

  // Email options
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Welcome to Our Platform!',
    text: 'Hello! Thank you for logging in. This is your welcome email.',
    html: '<h1>Welcome!</h1><p>Thank you for logging in. This is your welcome email.</p>'
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});