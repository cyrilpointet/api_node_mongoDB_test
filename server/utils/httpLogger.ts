import morgan from "morgan";
import { logger } from "./logger";

logger.stream = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  write: (message) =>
    logger.info(message.substring(0, message.lastIndexOf("\n"))),
};

export const httpLogger = morgan(
  ":method :url :status :response-time ms - :res[content-length]",
  { stream: logger.stream }
);
