import express from 'express';
import cors from 'cors';
import userRoutes from './routes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});