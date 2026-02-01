require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CRM MVP API is running' });
});

// Import routes (to be created)
// app.use('/api/auth', require('./src/routes/auth'));
// app.use('/api/contacts', require('./src/routes/contacts'));
// app.use('/api/deals', require('./src/routes/deals'));
// app.use('/api/emails', require('./src/routes/emails'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

module.exports = app;
