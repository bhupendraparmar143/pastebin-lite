require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Test mode: ${process.env.TEST_MODE === '1' ? 'enabled' : 'disabled'}`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
