const express = require('express');
const path = require('path');
const app = express();

// Serve static files from project root
app.use(express.static(path.join(__dirname, '..')));

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}/test/`);
}); 