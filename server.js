const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from the "Public" directory
app.use(express.static(path.join(__dirname, 'Public')));

// Serve assets from the "assets" directory (all lowercase)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
