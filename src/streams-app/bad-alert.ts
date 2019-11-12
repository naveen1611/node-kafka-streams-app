import { getBadAlertStreamsApp } from '../streams/streams-conn';
import { configuration } from '../libs/appconfig';
import { BadAlertProcessingModel } from '../models/badalertmodel';
//import { loginfo, logerror } from '../libs/logger';


export class BadAlertStreamsApp {

    constructor() { }

    badEventFieldMapperEtl(kafkaMessage: any) {
        let badEventMessage = kafkaMessage.value ? kafkaMessage.value.toString("utf8") : null;
        let badEventEntity = new BadAlertProcessingModel();
        let badEventJsonObj =  JSON.parse(badEventMessage);
        
        if (badEventJsonObj != null){
            badEventEntity.alertJson = JSON.stringify(badEventJsonObj.alertJson);
            badEventEntity.reason = badEventJsonObj.errorMessage.toString();
            let strProducerTimestamp = badEventJsonObj.producerTimestamp.toString();
            let numProducerTimestamp = +strProducerTimestamp; 
            let producerTimestamp = new Date(numProducerTimestamp).toISOString();
            badEventEntity.organizationName = badEventJsonObj.organizationName.toString();
            badEventEntity.clientId = badEventJsonObj.clientId.toString();
            badEventEntity.badAlertTime = producerTimestamp;
        }
        return badEventEntity;
    };

    processBadEvent(badEventEntity: BadAlertProcessingModel) {        
        return badEventEntity;
    }

    

    setBadAlertStreamApp(){        
        
        let kafkaStreams = getBadAlertStreamsApp();
        let topicName = configuration.topic.badAlert.name;
        let badEventStream = kafkaStreams.getKStream(topicName);
        console.log('Topic: ', topicName);

        badEventStream
            .map(this.badEventFieldMapperEtl)
            .map(this.processBadEvent)
            .tap(message => console.log(message))
            .to("bad-alert-streams-output");

        //start the stream
        //(wait for the kafka consumer to be ready)
        badEventStream.start().then(_ => {
            console.log("Bad-event stream started, as kafka consumer is ready.");
                //wait a few ms and close all connections
                //setTimeout(kafkaStreams.closeAll.bind(kafkaStreams), 30000);
                
            }, error => {
                console.log("Bad-event stream failed to start: " + error);
        });       
    
    }
}
