import 'dotenv/config.js';
import app from './app.js';
import { db } from './config/config.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  if (!error) {
    console.log(`Server running on port ${PORT}`);
  } else {
    console.log('Error starting server:', error);
  }
});