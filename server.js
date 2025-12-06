// server.js
const express = require("express");
const nodemailer = require('nodemailer');
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Home route → dashboard.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// Pretty URL routing for HTML files in any folder
app.get("/*", (req, res, next) => {
  const requestedPath = req.path; // e.g., /project/repo
  const filePath = path.join(__dirname, "public", requestedPath + ".html");

  res.sendFile(filePath, (err) => {
    if (err) next(); // if file doesn't exist, move to 404 handler
  });
});

// POST route to handle contact form submission
app.post('/send-message', async (req, res) => {
  const { name, email, message } = req.body;

  let transporter = nodemailer.createTransport({
      host: 'node64.lunes.host',
      port: 3198,
      secure: false, // no TLS
      tls: {
          rejectUnauthorized: false // allow self-signed / no cert
      }
  });

  try {
      await transporter.sendMail({
          from: '"Raqkid505" <sender@raqkidmail.com>',
          to: 'tester@raqkidmail.com',
          subject: 'Contacts in Vercel.app',
          text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      });

      console.log('Message sent.');
      res.status(200).send('Message sent successfully!');
  } catch (error) {
      console.error(error);
      res.status(500).send('Error sending message.');
  }
});

// 404 handler for non-existent routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});
