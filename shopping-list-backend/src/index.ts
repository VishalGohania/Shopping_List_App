import 'dotenv/config';
import express from "express";
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';


const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://shopping-list-app-frontend-jade.vercel.app'
  ]
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
