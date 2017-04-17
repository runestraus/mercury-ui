import { Logger, getLogger, Level, BrowserConsoleAppender, PatternLayout } from 'log4javascript';

export function getDebugLogger(name = 'debug-logger'): Logger {
  const debugLogger = getLogger(name);
  debugLogger.setLevel(Level.DEBUG);
  const appender = new BrowserConsoleAppender();
  appender.setLayout(new PatternLayout('%d %m'));
  debugLogger.addAppender(appender);
  return debugLogger;
}
