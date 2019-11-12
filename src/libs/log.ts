import { EnSeverity } from "./enums";

/**
 * Log interface
 */


export interface Logs {

    loginfo: (msg: string, methodname: string, severiety: EnSeverity) => void;
    logerror: (msg: string, StackTrace:any, methodname: string, severiety: EnSeverity) => void;
}


export class GADSLogs {

    public ClassName: string = '';
    public MethodName: string = '';
    public Message: string = '';
    public StackTrace: string = '';
    public LogDateTime: string = '';
    public Application: string = '';
    public APIName: string = '';
    public IPAddress: string = '';
    public LogLevel: string = '';
}