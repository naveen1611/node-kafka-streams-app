import { AlertModel } from '../models/alertmodel';
import { getStreamsApp } from '../streams/streams-conn';
import { configuration } from '../libs/appconfig';
import { Logger } from '../libs/logger';
import { EnSeverity } from '../libs/enums';

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
        return alertEntity;
    };

    processAlert(alertEntity: AlertModel) {
        return alertEntity;
    }

    setAlertStreamApp() {
        let log: Logger = new Logger('EnrichAlert');
        let kafkaStreams = getStreamsApp();
        let topicName = configuration.topic.alert.name;

        let eventStream = kafkaStreams.getKStream(topicName);
        console.log('topic: ', topicName);

        eventStream
            .map(this.alertFieldMapperEtl)
            .filter(alert => alert.severity.toString().toLowerCase() != "low")
            //.filter(alert => alert.value >= 150)
            .map(alert => JSON.stringify(alert))
            .map(this.processAlert)
            .tap(message => console.log(message))
            .to("alert-streams-output")



        //start the stream
        //(wait for the kafka consumer to be ready)
        eventStream.start().then(_ => {
            console.log("Alert stream started, as kafka consumer is ready.");
            //wait a few ms and close all connections
            //setTimeout(kafkaStreams.closeAll.bind(kafkaStreams), 30000);

        }, error => {
            log.logerror('Alert streams failed to start: ', error, "setAlertStreamApp", EnSeverity.critical);
            console.log("Alert streams failed to start: " + error);
        });
    };
}
