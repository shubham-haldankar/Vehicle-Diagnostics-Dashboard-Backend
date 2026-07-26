import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
// import routes from "./src/routes/index.js";
import { initializeDatabase } from "./src/config/database.js";
// import { errorMiddleware } from "./src/middleware/error.middleware.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);
app.use(express.json());

// app.use(routes);
// app.use(errorMiddleware);

try {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("Startup failed:", error);
  process.exit(1);
}

export default app;
