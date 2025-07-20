export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  meta?: Record<string, any>;
  source?: string;
}

class Logger {
  private level: LogLevel;
  
  constructor() {
    const envLevel = process.env.LOG_LEVEL?.toUpperCase();
    this.level = LogLevel[envLevel as keyof typeof LogLevel] ?? LogLevel.INFO;
  }
  
  private formatMessage(entry: LogEntry): string {
    const levelName = LogLevel[entry.level];
    const meta = entry.meta ? ` ${JSON.stringify(entry.meta)}` : '';
    const source = entry.source ? ` [${entry.source}]` : '';
    return `${entry.timestamp} ${levelName}${source}: ${entry.message}${meta}`;
  }
  
  private log(level: LogLevel, message: string, meta?: Record<string, any>, source?: string) {
    if (level < this.level) return;
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
      source
    };
    
    const formatted = this.formatMessage(entry);
    
    if (level >= LogLevel.ERROR) {
      console.error(formatted);
    } else if (level >= LogLevel.WARN) {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }
  }
  
  debug(message: string, meta?: Record<string, any>, source?: string) {
    this.log(LogLevel.DEBUG, message, meta, source);
  }
  
  info(message: string, meta?: Record<string, any>, source?: string) {
    this.log(LogLevel.INFO, message, meta, source);
  }
  
  warn(message: string, meta?: Record<string, any>, source?: string) {
    this.log(LogLevel.WARN, message, meta, source);
  }
  
  error(message: string, meta?: Record<string, any>, source?: string) {
    this.log(LogLevel.ERROR, message, meta, source);
  }
  
  critical(message: string, meta?: Record<string, any>, source?: string) {
    this.log(LogLevel.CRITICAL, message, meta, source);
  }
  
  // Security-specific logging
  security(event: string, details: Record<string, any>) {
    this.warn(`SECURITY: ${event}`, details, 'security');
  }
  
  audit(action: string, userId: string, details: Record<string, any>) {
    this.info(`AUDIT: ${action}`, { userId, ...details }, 'audit');
  }
}

export const logger = new Logger();