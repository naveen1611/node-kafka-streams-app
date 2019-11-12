import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { configuration } from './libs/appconfig';
import { Route } from './routes/api-routes';
import { Logger } from './libs/logger';
import { AppError } from './libs/apperror';
import { EnrichAlert } from "./streams-app/enrich-alert";
import { BadAlertStreamsApp } from './streams-app/bad-alert';

const PORT = process.env.PORT || configuration.httpport;

const app: express.Express = express();
const log:Logger = new Logger('ApplicationError');

process.on("uncaughtException", e => {
  let error = new AppError(`getting route exception- ${e.message}`,e.stack, log, "uncaughtException");
  express.response.status(500).send({ error: error });
});

process.on("unhandledRejection", e => {
  let error = new AppError(`getting route exception- ${e.message}`,e.stack, log, "unhandledRejection");
  express.response.status(500).send({ error: error });
});

function setMiddleware(): void {

  app.use(cors());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({
    'limit': "50mb",
    'extended': true,
    'parameterLimit': 10000
  }));
  app.use( bodyParser.json() );       // to support JSON-encoded bodies
  
  new Route(app).route();
  new EnrichAlert().setAlertStreamApp();
  new BadAlertStreamsApp().setBadAlertStreamApp();
 

  app.use((e: Error/* , req: express.Request, res: express.Response, next: express.NextFunction */) => {
    let error = new AppError(`getting route exception- ${e.message}`,e.stack, log, "routeException");
    express.response.status(500).send({ error: error });
  });
}

function startApp() {

  setMiddleware();

  app.listen(PORT, () =>
    console.log(`Producer Server is running http://localhost:${PORT}...`)
  );
}

startApp();
