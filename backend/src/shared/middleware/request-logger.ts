import pinoHttp from "pino-http";
import logger from "../config/logger";

export const requestLogger = pinoHttp({
  logger,
  genReqId: (req) => (req as any).id || crypto.randomUUID(),
  customLogLevel: (_req, res, err) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
  customErrorMessage: (req, _res, err) => {
    return `${req.method} ${req.url} error: ${err.message}`;
  },
  autoLogging: {
    ignore: (req) => req.url === "/api/health",
  },
});
