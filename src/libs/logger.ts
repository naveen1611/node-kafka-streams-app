/**
 * Logger file
 */
import * as winston from 'winston';
import * as path from 'path';
import * as Requests from 'request';
import { configuration } from './appconfig';
import { EnSeverity } from './enums';
import { Logs, GADSLogs } from './log';

let lpath: string = configuration.log.path;
let logging: string = configuration.log.logging;
let appName: string = configuration.applicationname;
let logurl: string = configuration.log.url;

const errlogger: winston.Logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname, '..', lpath,
                `gads_${new Date().getDate()}_${new Date().getMonth()}_${new Date().getFullYear()}_err.log`)
        })
    ],
    level: 'error'
});

const infologger: winston.Logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname, '..', lpath,
                `gads_${new Date().getDate()}_${new Date().getMonth()}_${new Date().getFullYear()}_info.log`)
        })
    ],
    level: 'info'
});


export class Logger implements Logs {
    private classname: string;
    private logson: number = configuration.log.env;

    constructor(classnam: string) {
        this.classname = classnam;
    }

    loginfo(msg: string, methodname: string, severiety: EnSeverity): void {

        if (this.logson == 0) {
            if (logging.toLowerCase().includes("kibana")) {
                let log: GADSLogs = {
                    Application: appName,
                    APIName: this.classname,
                    ClassName: this.classname,
                    MethodName: methodname,
                    Message: msg,
                    StackTrace: '',
                    LogDateTime: new Date().toString(),
                    IPAddress: '',
                    LogLevel: 'info'
                };

                Requests({
                    url: logurl,
                    method: "POST",
                    json: true,
                    body: log
                }, function (err, _response, _body) {
                    if (err) {
                        console.log(err);
                    }
                });
            } else {
                if (!severiety) { severiety = EnSeverity.low; }
                let messagestr: string = "anpplicationame--> " + appName + ', severiety--> ' + severiety + ', classname--> ' + this.classname + ', methodname--> '
                    + methodname + ', message--> ' + msg;
                infologger.info(messagestr);
            }
        }
    }

    logerror(msg: string, stackStrace: any, methodname: string, severiety: EnSeverity): void {
        if (this.logson == 0) {
            if (logging.toLowerCase().includes("kibana")) {

                let log: GADSLogs = {
                    Application: appName,
                    APIName: this.classname,
                    ClassName: this.classname,
                    MethodName: methodname,
                    Message: msg,
                    StackTrace: stackStrace,
                    LogDateTime: new Date().toString(),
                    IPAddress: '',
                    LogLevel: 'error'
                };

                Requests({
                    url: logurl,
                    method: "POST",
                    json: true,
                    body: log
                }, function (err, _response, _body) {
                    if (err) {
                        console.log(err);
                    }
                });
            } else
                if (!severiety) { severiety = EnSeverity.high; }
            let messagestr: string = "anpplicationame--> " + appName + ', severiety--> ' + severiety + ', classname--> ' + this.classname + ', methodname--> '
                + methodname + ', message--> ' + msg + ', stackStrace--> ' + stackStrace;
            errlogger.error(messagestr);
        }
    }
}