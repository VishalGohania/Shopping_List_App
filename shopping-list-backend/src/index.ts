import 'dotenv/config';
import express from "express";
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
