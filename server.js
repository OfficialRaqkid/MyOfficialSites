// server.js
const express = require("express");
const nodemailer = require('nodemailer');
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route → dashboard.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// Redirect any /something.html → /something
app.get("/:page.html", (req, res) => {
  res.redirect(`/${req.params.page}`);
});

// Serve routes like /about → about.html
app.get("/:page", (req, res, next) => {
  const pagePath = path.join(__dirname, "public", `${req.params.page}.html`);
  res.sendFile(pagePath, (err) => {
    if (err) next(); // If not found → go to 404 handler
  });
});

app.get("/projects/:page", (req, res, next) => {
  const pagePath = path.join(__dirname, "public", `${req.params.page}.html`);
  res.sendFile(pagePath, (err) => {
    if (err) next(); // If not found → go to 404 handler
  });
});

// POST route to handle contact form submission
app.post('/send-message', async (req, res) => {
  const { name, email, message } = req.body;

  let transporter = nodemailer.createTransport({
      host: "192.168.188.124",
      port: 9362,
      secure: false, // no TLS
      tls: {
          rejectUnauthorized: false // allow self-signed / no cert
      }
  });

  try {
      let info = await transporter.sendMail({
          from: `sender@raqkidmail.com`,
          to: 'admin@raqkidmail.com', // must be a recipient in your hosted domain
          subject: 'Message from Vercel.app',
          text: `Email: ${email}\n\n\nName: ${name}\n\n\nMessage: ${message}`,
      });

      console.log('Message sent.');
      res.status(200).send('Message sent successfully!');
  } catch (error) {
      console.error(error);
      res.status(500).send('Error sending message.');
  }
});

// 404 handler (invalid route)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});
