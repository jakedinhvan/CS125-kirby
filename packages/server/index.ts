import express, { Request, Response } from "express";
import path from "path";
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import animeRoutes from "./routes/animeRoutes";
import genreRoutes from "./routes/genreRoutes";
import likeRoutes from "./routes/likeRoutes";
import * as schema from "./src/db/schema";

const app = express();
export const db = drizzle(process.env.DATABASE_URL!, { schema });

app.use(express.json()); // for POST request bodies
app.use(express.static("public")); // serve static files

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// POST with different features
app.use("/api/anime", animeRoutes); 
app.use('/api/genres', genreRoutes);
app.use('/api/likes', likeRoutes);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});