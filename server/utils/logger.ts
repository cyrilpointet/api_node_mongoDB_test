import { createLogger, transports, format } from "winston";

export const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.File({
      filename: "./logs/logs.log",
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new transports.File({
      filename: "./logs/errors.log",
      maxsize: 5242880,
      maxFiles: 5,
      level: "error",
    }),
    new transports.Console(),
  ],
});
