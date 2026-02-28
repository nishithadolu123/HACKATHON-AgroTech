import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("plantcare.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plant_name TEXT,
    disease_name TEXT,
    confidence REAL,
    image_url TEXT,
    remedies TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Routes
  app.get("/api/history", (req, res) => {
    const history = db.prepare("SELECT * FROM history ORDER BY created_at DESC").all();
    res.json(history);
  });

  app.post("/api/history", (req, res) => {
    const { plant_name, disease_name, confidence, image_url, remedies } = req.body;
    const info = db.prepare(
      "INSERT INTO history (plant_name, disease_name, confidence, image_url, remedies) VALUES (?, ?, ?, ?, ?)"
    ).run(plant_name, disease_name, confidence, image_url, JSON.stringify(remedies));
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/stats", (req, res) => {
    const total = db.prepare("SELECT COUNT(*) as count FROM history").get() as { count: number };
    const healthy = db.prepare("SELECT COUNT(*) as count FROM history WHERE disease_name LIKE '%healthy%'").get() as { count: number };
    res.json({
      totalScans: total.count,
      healthyPlants: healthy.count,
      diseasedPlants: total.count - healthy.count
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
