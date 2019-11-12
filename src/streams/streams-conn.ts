import { Logger } from '../libs/logger';
import { EnSeverity } from '../libs/enums';
import { configuration } from '../libs/appconfig';
import * as kafkaStreamsForTyping from 'kafka-streams';
const {KafkaStreams} = require("kafka-streams");

let log: Logger = new Logger('StreamsConnection');

/* USING ONE CONFIG FOR ALL STREAMS APP */
let config = 
{
    kafkaHost: configuration.streams.kafkaHost,
    groupId: configuration.streams.groupId,
    clientName: configuration.streams.clientName,
    workerPerPartition: configuration.streams.workerPerPartition,
    options: {
        sessionTimeout: configuration.streams.options.sessionTimeout,
        protocol: [configuration.streams.options.protocol],
        fromOffset: configuration.streams.options.fromOffset, //earliest, latest
        fetchMaxBytes: configuration.streams.options.fetchMaxBytes,
        fetchMinBytes: configuration.streams.options.fetchMinBytes,
        fetchMaxWaitMs: configuration.streams.options.fetchMaxWaitMs,
        heartbeatInterval: configuration.streams.options.heartbeatInterval,
        retryMinTimeout: configuration.streams.options.retryMinTimeout,
        autoCommit: configuration.streams.options.autoCommit,
        autoCommitIntervalMs: configuration.streams.options.autoCommitIntervalMs,
        requireAcks: configuration.streams.options.requireAcks,
        ackTimeoutMs: configuration.streams.options.ackTimeoutMs,
        //partitionerType: configuration.streams.options.partitionerType
    }
};

// ALERT STREAM APP
let kafkaStreams = new KafkaStreams(config);

kafkaStreams.on('error', (error: Error) => {
    log.logerror('Error occured in ALERT Streams App:', error.message, "ALERTStreamConn", EnSeverity.critical);
    
});


kafkaStreams.on('ready', function () {
    console.log('***ALERT Streams Application is ready***');
    log.loginfo('***ALERT Streams Application is ready***', "ALERTStreamConn", EnSeverity.high);
    setStreamsApp(kafkaStreams);
    //enrichAlert.setStreamApp(); 
    
});


export function getStreamsApp(): kafkaStreamsForTyping.KafkaStreams {
    return kafkaStreams;
} 

export function setStreamsApp(streamsObj: kafkaStreamsForTyping.KafkaStreams): void {
    kafkaStreams = streamsObj;
} 

/* BAD EVENT STREAMS APP */
let badAlertStreams = new KafkaStreams(config);

badAlertStreams.on('error', (error: Error) => {
    log.logerror('Error occured in Bad Alert Streams App', error.message, "BadAlertStreamConn", EnSeverity.critical);
    
});


badAlertStreams.on('ready', function () {
    console.log('***Bad Alert Streams Application is ready***');
    log.loginfo('***Bad Alert Streams Application is ready***', "BadAlertStreamConn", EnSeverity.high);
    setBadAlertStreamsApp(badAlertStreams);    
});


export function getBadAlertStreamsApp(): kafkaStreamsForTyping.KafkaStreams {
    return badAlertStreams;
} 

export function setBadAlertStreamsApp(streamsObj: kafkaStreamsForTyping.KafkaStreams): void {
    badAlertStreams = streamsObj;
} 
