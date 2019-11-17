import { AlertModel, User, EnrichedAlertModel, AlertInputModel } from '../models/alertmodel';
import { BadAlertModel } from '../models/badalertmodel';
import { getStreamsApp } from '../streams/streams-conn';
import { configuration } from '../libs/appconfig';
import { Logger } from '../libs/logger';
import { EnSeverity } from '../libs/enums';
import { AlertUsers } from '../redis/alertusers';
import { Alerts } from '../produce/alertProducer';
import { Constant } from '../libs/constants';

export class EnrichAlert {

    constructor() { }

    alertFieldMapperEtl(kafkaMessage: any) {
        let log: Logger = new Logger('EnrichAlert');
        let alertMessage = kafkaMessage.value ? kafkaMessage.value.toString("utf8") : null;
        let alertJsonObj = JSON.parse(alertMessage);
        let alertEntity = new AlertModel();

        if (alertJsonObj != null) {
            alertEntity.builderId = alertJsonObj.builderId;
            alertEntity.buildingId = alertJsonObj.buildingId;
            alertEntity.deviceId = alertJsonObj.deviceId;
            alertEntity.eventTimestamp = alertJsonObj.eventTimestamp;
            alertEntity.severity = alertJsonObj.severity;
            alertEntity.value = alertJsonObj.value;
            alertEntity.name = alertJsonObj.name;
        }
        log.loginfo("Started processing new event.." + alertMessage, "eventFieldMapperEtl", EnSeverity.medium);
        console.log(alertEntity);
        return alertEntity;
    };

    processAlert(alertEntity: AlertModel) {
        let log: Logger = new Logger('EnrichAlert');
        let producer: Alerts = new Alerts();
        let alertUsers: AlertUsers = new AlertUsers();
        let enricherdAlert: EnrichedAlertModel = new EnrichedAlertModel();

        enricherdAlert.alert = alertEntity;

        async function execAlertWF() {
            try {


                let filteredUsers = await getAlertUsers(alertEntity);

                if (filteredUsers == Constant.NoUserFound) {
                    // Produce to bad alert topic
                    produceBadAlert(alertEntity, filteredUsers);
                }
                else {
                    let alertUsersArray: User[] = filteredUsers;
                    enricherdAlert.users = alertUsersArray;
                    log.loginfo("Enriched Alert is: " + enricherdAlert, "processAlert", EnSeverity.medium);

                    produceEnrichedAlert(enricherdAlert);
                }
            }
            catch (e) {
                log.logerror('Error occurred while processing alert', e.message, "processAlert", EnSeverity.critical);
                console.log(e);
            }
        }
        //enricherdAlertOut = execAlertWF();
        execAlertWF();

        function produceBadAlert(alertEntity: AlertModel, reason: string) {
            let badAlertModel = new BadAlertModel();
            let badAlertModelArr: BadAlertModel[] = [];
            let aim: AlertInputModel = new AlertInputModel();
            aim.builderId = alertEntity.builderId;
            aim.path.buildingId = alertEntity.buildingId;
            aim.path.deviceId = alertEntity.deviceId;
            aim.eventTimestamp = alertEntity.eventTimestamp;
            aim.severity = alertEntity.severity;
            aim.value = alertEntity.value;
            aim.name = alertEntity.name;
            badAlertModel.alertJson = aim;
            badAlertModel.reason = reason;
            badAlertModel.producerTimestamp = Date.now().toString();
            badAlertModelArr.push(badAlertModel);
            producer.produceBadAlert(badAlertModelArr, (done: any) => {
                console.log("Produced Bad alert as users are not mapped for alert: " + JSON.stringify(done));
                log.loginfo("Produced Bad alert as users are not mapped for alert: " + JSON.stringify(aim), "Produced Bad Alert", EnSeverity.high);
            });
        }

        function produceEnrichedAlert(enrichedAlertEntity: EnrichedAlertModel) {            
            producer.produceEnrichedAlert(enrichedAlertEntity, (done: any) => {
                console.log("Produced Enriched alert: " + JSON.stringify(done));
                log.loginfo("Produced Enriched alert: " + JSON.stringify(enricherdAlert), "Produced Enriched Alert", EnSeverity.high);
            });
        }

        function getAlertUsers(alertEntity: AlertModel): Promise<any> {
            return new Promise((resolve: (res: any) => void) => { //, reject: (err: Error) => void
                alertUsers.getAlertUsers(alertEntity, (filteredUsers: any) => {
                    resolve(filteredUsers);
                });
            });
        }
        return enricherdAlert;
    }


    setAlertStreamApp() {
        let log: Logger = new Logger('EnrichAlert');
        let kafkaStreams = getStreamsApp();
        let topicName = configuration.topic.alert.name;

        let eventStream = kafkaStreams.getKStream(topicName);
        console.log('topic: ', topicName);


        //Promise.all([
        eventStream
            .map(this.alertFieldMapperEtl)
            .filter(alert => alert.severity.toString().toLowerCase() != "low")
            //.filter(alert => alert.value >= 150)
            .map(this.processAlert)
            .map(x => JSON.stringify(x))
            .tap(message => console.log(message))
            .to("alert-streams-output")


        //start the stream
        //(wait for the kafka consumer to be ready)        
        // eventStream.start().then(_ => {
        //     console.log("Alert stream started, as kafka consumer is ready.");
        //     //wait a few ms and close all connections
        //     //setTimeout(kafkaStreams.closeAll.bind(kafkaStreams), 30000);

        // }, error => {
        //     log.logerror('Alert streams failed to start: ', error, "setAlertStreamApp", EnSeverity.critical);
        //     console.log("Alert streams failed to start: " + error);
        // });

        Promise.all([
            eventStream.start()
        ])
            .then(_ => {
                console.log("Alert stream started, as kafka consumer is ready.");
                //wait a few ms and close all connections
                //setTimeout(kafkaStreams.closeAll.bind(kafkaStreams), 30000);

            }, error => {
                log.logerror('Alert streams failed to start: ', error, "setAlertStreamApp", EnSeverity.critical);
                console.log("Alert streams failed to start: " + error);
            });
    };
}
