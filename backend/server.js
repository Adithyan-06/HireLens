import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jobRoutes from './routes/jobRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import rankingRoutes from './routes/rankingRoutes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/jobs', jobRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/rankings', rankingRoutes);

app.get('/', (req, res) => {
  res.json({ message: "HireLens API is running with ES Modules..." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});