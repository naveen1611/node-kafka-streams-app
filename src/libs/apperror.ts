import { Logger } from '../libs/logger';
import { EnSeverity } from '../libs/enums';

export class AppError extends Error {
    status: number = 500;

    constructor(message: string, stack:any, logger: Logger, methodname:string, status?: number) {        

        // Calling parent constructor of base Error class.
        super(message);
        // Saving class name in the property of our custom error as a shortcut.
        this.name = message;
        this.message = message;
        this.stack = stack;
        // Capturing stack trace, excluding constructor call from it.
        Error.captureStackTrace(this, this.constructor);
        // You can use any additional properties you want.
        // I'm going to use preferred HTTP status for this error types.
        // `500` is the default value if not specified.
        this.status = status || 500;  
        //log the error
        logger.logerror(message, stack, methodname, EnSeverity.critical);
    }
};