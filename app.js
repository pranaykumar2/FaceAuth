const express = require('express');
const path = require('path');
const app = express();

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/home'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
