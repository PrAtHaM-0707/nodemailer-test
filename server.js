const express = require('express');
const emailjs = require('@emailjs/nodejs');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY
});

app.use(bodyParser.json());
app.use(cors({
  origin: ['http://localhost:3000', 'https://nodemailer-test-seven.vercel.app']
}));

app.post('/send-email', async (req, res) => {
  const { email } = req.body;

  console.log('Received email request:', { email });

  if (!email || !email.includes('@gmail.com')) {
    console.log('Invalid email:', email);
    return res.status(400).json({ error: 'Please provide a valid Gmail address.' });
  }

  const templateParams = {
    email: email,
    from_email: process.env.SENDER_EMAIL
  };

  try {
    console.log('Attempting to send email to:', email);
    await emailjs.send(process.env.EMAILJS_SERVICE_ID, process.env.EMAILJS_TEMPLATE_ID, templateParams);
    console.log('Email sent successfully to:', email);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});