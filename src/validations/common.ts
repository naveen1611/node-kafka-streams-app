import * as express from 'express';

export function getHeaders(req: express.Request): any {

    const headerToken: string = (req.cookies && req.cookies.token) || (req.headers && req.headers.authorization);
    const headerApp: string = (req.cookies && req.cookies.appName) || (req.headers && req.headers.appname);

    const appName = headerApp.trim();

    let customheader = {
        'appName': appName,
        'content-type': 'application/json',
        'Authorization': headerToken
    };

    return customheader;
}