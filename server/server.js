require('dotenv').config();
const app = require('./app');
const { db, bucket } = require('./config/config');

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  if (!error) {
    console.log(`Server running on port ${PORT}`);
  } else {
    console.log('Error starting server:', error);
  }
});