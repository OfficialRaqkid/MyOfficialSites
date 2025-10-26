// server.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, "public")));

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

// 404 handler (invalid route)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});
