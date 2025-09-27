import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors({
  origin: ['http://localhost:3000', 'https://nodemailer-test-seven.vercel.app']
}));

app.post('/send-email', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@gmail.com')) {
    return res.status(400).json({ error: 'Please provide a valid Gmail address.' });
  }

  const payload = {
    sender: { name: "Your Name", email: process.env.SENDER_EMAIL },
    to: [{ email: email }],
    subject: "Welcome to My Project",
    htmlContent: `<h1>Hello ${email}!</h1><p>Welcome to my project!</p>`
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json();
      return res.status(500).json({ error: 'Failed to send email', details: errData });
    }

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
