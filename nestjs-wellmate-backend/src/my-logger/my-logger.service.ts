import { Injectable, ConsoleLogger, Scope } from '@nestjs/common';

@Injectable()
export class MyLoggerService extends ConsoleLogger {
  error(message: unknown, stackOrContext?: string) {
    super.error(message, stackOrContext);
  }

  warn(message: unknown, context?: string) {
    super.warn(message, context);
  }

  log(message: unknown, context?: string) {
    super.log(message, context);
  }
}
