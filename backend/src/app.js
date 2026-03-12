import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import billRoutes from './routes/billRoutes.js';
import backupRoutes from './routes/backupRoutes.js';
import billModel from './models/billModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/bills', billRoutes);
app.use('/api/v1/backup', backupRoutes);

// Serve privacy policy at /bill47/privacy
app.get('/api/v1/bill47/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, '../../privacy-policy.html'));
});

// Redirect root to privacy policy
app.get('/', (req, res) => {
  res.redirect('/api/v1/bill47/privacy');
});

export default app;
