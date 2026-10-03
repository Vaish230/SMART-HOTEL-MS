import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.route.ts";
import "dotenv/config";
import cookieParser from "cookie-parser";

const app = express();


app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);



app.get("/", (req, res) => {
    res.json({
        message: "Hotel Management API is running 🚀",
    });
});


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});