import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import "dotenv/config";
import { auth } from "./routes/auth.js";
import { transfers } from "./routes/transfers.js";
import { webhooks } from "./routes/webhooks.js";

const app = express();

app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: false
  })
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10),
  max: parseInt(process.env.RATE_LIMIT_MAX || "60", 10)
}));

app.get("/health", (_req, res) => res.json({ ok: true }));

// JSON body for API endpoints
app.use(express.json({ limit: "512kb" }));

// Routes
app.use("/auth", auth);
app.use("/transfers", transfers);

// Raw body only for webhooks route (applied inside the router)
app.use("/webhooks", webhooks);

const port = parseInt(process.env.PORT || "8080", 10);
app.listen(port, () => console.log(`Server listening on :${port}`));

