const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoos= require('mongoose');
// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    'https://lifproject-management.vercel.app',
    'http://localhost:3000',
    'https://lifproject-management.vercel.app/' // with trailing slash for safety
  ],
  credentials: true
}));
mongoos.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
// Project Details API
const projectDetailsRouter = require('./routes/projectDetails');
app.use('/api/projects', projectDetailsRouter);

const mnapower=require('./routes/manpowerRoutes');
app.use('/api/manpower', mnapower);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
