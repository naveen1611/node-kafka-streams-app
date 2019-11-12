/**
 * Instantiate Alert Producer
 */

import * as kafka from 'kafka-node';
import { configuration } from '../libs/appconfig';
import { Logger } from '../libs/logger';
import { EnSeverity} from '../libs/enums';

let log: Logger = new Logger('BadAlertProduce');

let clientOpts = {
    kafkaHost: configuration.kafkaClient.kafkaHost,
    connectTimeout: configuration.kafkaClient.connectTimeout,
    maxAsyncRequests: configuration.kafkaClient.maxAsyncRequests,
    requestTimeout: configuration.kafkaClient.requestTimeout
};

let badAlertProducerOpts = 
{
    // Configuration for when to consider a message as acknowledged, default 1
    requireAcks: configuration.producer.badAlert.requireAcks,
    // The amount of time in milliseconds to wait for all acks before considered, default 100ms
    ackTimeoutMs: configuration.producer.badAlert.ackTimeoutMs,
    // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0
    partitionerType: configuration.producer.badAlert.partitionerType
};

let BadAlertProducer = kafka.Producer,
  badAlertClient = new kafka.KafkaClient(clientOpts),
  badAlertProducer = new BadAlertProducer(badAlertClient, badAlertProducerOpts);

badAlertProducer.on('ready', function () {
    log.loginfo('***Bad Alert Producer is ready***', "Ready BadAlert Producer", EnSeverity.high);
    setBadAlertProducer(badAlertProducer);
});

badAlertProducer.on('error', function (err) {
    log.logerror('Bad Alert Producer is in error state', err, "Ready BadAlert Producer", EnSeverity.critical);
});

export function getBadAlertProducer(): kafka.Producer {
    return badAlertProducer;
} 

export function setBadAlertProducer(producerObj: kafka.Producer): void {
    badAlertProducer = producerObj;
} 

