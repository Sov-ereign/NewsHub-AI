import dotenv from 'dotenv';
import connectDB from './db.js';
import app from './server.js';

dotenv.config();

const startServer = async () => {
  await connectDB();
  const PORT = 5000; // Force port 5000 to match Vite proxy
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

// Optionally, start the server if needed
// import app from './server.js';
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// }); 