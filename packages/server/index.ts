import express, { Request, Response } from "express";
import path from "path";
import { searchName, searchGenre } from "./controller";
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

const app = express();
const db = drizzle(process.env.DATABASE_URL!);

console.log("Test");

app.use(express.json()); // for POST request bodies
app.use(express.static("public")); // serve static files

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// POST with different features
app.post("/api/kirby/searchname", searchName);
app.post("/api/kirby/searchgenre", searchGenre);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});