import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import protectedRoutes from "./routes/protected.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(cookieParser());

app.use("/api/auth/", authRoutes);
app.use("/api/protected", protectedRoutes);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('MetricPal Backend API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
