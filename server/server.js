import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { initSocket } from './socket.js';
import cookieParser from 'cookie-parser'
dotenv.config();
import path from 'path'; // Node's built-in modules are prefixed with 'node:' in some newer contexts, but 'path' usually works fine.
import { fileURLToPath } from 'url'; // Required to get __dirname equivalent
import authRoute from './routes/authRoutes.js';
import router from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);
const io = initSocket(httpServer);

// Middleware
app.use(cookieParser());
app.use(cors({
    origin: [process.env.BASE_URL,"http://localhost:5173","http://192.168.121.107:5173"],
    credentials: true,
    methods: ["POST", "GET", "DELETE", "PATCH"]
}));
app.use(express.json());

// Routes
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use("/api",router);
// app.use("/api/auth",authRoute);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});