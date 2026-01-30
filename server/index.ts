import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { logApiRequest } from "./vite-shim";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logApiRequest);

(async () => {
  const server = registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Since this is a Next.js app, the Next.js dev server handles the frontend on port 5000.
  // We just need to ensure the API routes are registered.
  
  const PORT = 5001; // API server on different port if needed, but Next.js usually handles this
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`API server serving on port ${PORT}`);
  });
})();
