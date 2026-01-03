import express from "express";
import { Request, Response } from "express";
import { rateLimiter } from "./rate_limiter";

const app = express();
const PORT = process.env.PORT ?? 8080;

app.get("/", rateLimiter, async (req: Request, res: Response) => {
  return res.json({ message: "Hello" });
});

app.listen(PORT, () => console.log(`Server is listing on PORT ${PORT}`));
