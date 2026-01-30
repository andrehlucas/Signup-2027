import { type Request, Response, NextFunction } from "express";

export function logApiRequest(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: any = undefined;

  const oldJson = res.json;
  res.json = function (body) {
    capturedJsonResponse = body;
    return oldJson.apply(res, arguments as any);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
}
