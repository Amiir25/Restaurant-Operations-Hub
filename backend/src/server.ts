import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status:'OK',
        message: 'Restaurant Oprations Hub API is running',
        timestamp: new Date().toISOString()
    });
});

// Routes
import authRoutes from "./routes/auth.routes.ts";

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
});