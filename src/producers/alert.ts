/**
 * Instantiate Alert Producer
 */

import * as kafka from 'kafka-node';
import { configuration } from '../libs/appconfig';
import { Logger } from '../libs/logger';
import { EnSeverity} from '../libs/enums';

let log: Logger = new Logger('AlertProduce');

let clientOpts = {
    kafkaHost: configuration.kafkaClient.kafkaHost,
    //sasl: configuration.kafkaClient.sasl,
    connectTimeout: configuration.kafkaClient.connectTimeout,
    maxAsyncRequests: configuration.kafkaClient.maxAsyncRequests,
    requestTimeout: configuration.kafkaClient.requestTimeout
};

let alertProducerOpts = 
{
    // Configuration for when to consider a message as acknowledged, default 1
    requireAcks: configuration.producer.alert.requireAcks,
    // The amount of time in milliseconds to wait for all acks before considered, default 100ms
    ackTimeoutMs: configuration.producer.alert.ackTimeoutMs,
    // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0
    partitionerType: configuration.producer.alert.partitionerType
};

let AlertProducer = kafka.Producer,
  alertClient = new kafka.KafkaClient(clientOpts),
  alertProducer = new AlertProducer(alertClient, alertProducerOpts);

alertProducer.on('ready', function () {
    log.loginfo('***Alert Producer is ready***', "Ready Alert Producer", EnSeverity.high);
    setAlertProducer(alertProducer);
});

alertProducer.on('error', function (err) {
    log.logerror('Alert Producer is in error state', err, "Ready Alert Producer", EnSeverity.critical);    
});

export function getAlertProducer(): kafka.Producer {
    return alertProducer;
} 

export function setAlertProducer(producerObj: kafka.Producer): void {
    alertProducer = producerObj;
} 
