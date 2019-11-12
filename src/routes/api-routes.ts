/**
 * routes
 */
import * as express from 'express';
import { AlertsAPI } from '../api/alertapi';


export class Route {

    private alert: AlertsAPI = new AlertsAPI();
    
    constructor(private app: express.Express) { }
    
    route(): void {

        this.app.get('/', (req: express.Request, res: express.Response) => {
            res.send(req.header + 'Welcome');
        });

        this.app.post('/sendAlert', (req: express.Request, res: express.Response) => {
            this.alert.produceAlert(req, res);
        });
    }
}