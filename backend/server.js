require("dotenv").config();
const express = require("express");
const cors = require("cors");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// ──────────────────────────────────────────────────────────────────────────────
// CORS — single shared config used for BOTH the middleware and preflight handler
// ──────────────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  "https://campuscraves.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server / curl calls (no Origin header) in dev
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204, // some legacy browsers choke on 204
};

// Apply CORS headers to every request (including preflight)
app.use(cors(corsOptions));

// Explicit preflight handler — MUST use the SAME corsOptions, not a bare cors()
app.options("*", cors(corsOptions));

app.use(express.json());

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Routes
app.use("/api", paymentRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
