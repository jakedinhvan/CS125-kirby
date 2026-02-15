import express, { Request, Response } from "express";
import path from "path";
import { searchName, searchGenre, createUser, addLike, getUsers } from "./controller";

const app = express();


console.log("Test");

app.use(express.json()); // for POST request bodies
app.use(express.static("public")); // serve static files

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// POST with different features
app.post("/api/kirby/searchname", searchName);
app.post("/api/kirby/searchgenre", searchGenre);
app.post("/api/kirby/createUser", createUser);
app.post("/api/kirby/addLike", addLike);
app.post("/api/kirby/getUsers", getUsers);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});