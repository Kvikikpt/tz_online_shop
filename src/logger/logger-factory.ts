import {
  Container,
  format,
  Logform,
  Logger as WinstonLogger,
  LoggerOptions,
  transports,
} from 'winston';

const formatMeta = (meta) => {
  const splat = meta[Symbol.for('splat')];
  if (splat && splat.length) {
    return splat.length === 1 ? JSON.stringify(splat[0]) : JSON.stringify(splat);
  }
  return '';
};

const textFormat = format.printf(({ level, message, metadata, ...meta }) => {
  const { label, timestamp } = metadata;
  return `${timestamp} [${label}] ${level}: ${message} ${formatMeta(meta)}`;
});

const createNewLogger = (name: string, format: Logform.Format): LoggerOptions => {
  return {
    format: format,
    defaultMeta: {
      label: name,
      source: name.toLowerCase(),
    },
    transports: [new transports.Console()],
    exitOnError: false,
  };
};

export class LoggerFactory {
  private static container: Container = new Container();

  public static getLogger(name = 'default'): WinstonLogger {
    if (this.container.has(name)) {
      return this.container.get(name);
    }

    return this.container.add(
      name,
      createNewLogger(
        name,
        format.combine(
          format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          format.metadata(),
          format.colorize(),
          textFormat
        )
      )
    );
  }
}
