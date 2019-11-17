import { getAlertProducer } from '../producers/alert';
import { getBadAlertProducer } from '../producers/badalert';
import { AlertModel, EnrichedAlertModel } from '../models/alertmodel';
import { BadAlertModel } from '../models/badalertmodel';
import { configuration } from '../libs/appconfig';
import { Logger } from '../libs/logger';
import { EnSeverity } from '../libs/enums';


export class Alerts {

  private log: Logger = new Logger('Alerts');

  constructor() { }

  produceAlert(entityArray: AlertModel[], callback: (result: any) => void) {

    const _that = this;
    let producer = getAlertProducer();
    let topicName = configuration.topic.alert.name;
    let produceTopic = topicName;

    let payloads: {
      topic: any;
      messages: any;
      key: any;
      attributes: any;
      timestamp: any;
    }[] = [];

    for (var i = 0; i < entityArray.length; i++) {
      let digestedAlertMessage = this.digestAlertMessage(entityArray[i]);

      let msgKey = digestedAlertMessage.key,
        msgValueJsonString = digestedAlertMessage.value,
        compressionType = configuration.topic.alert.compressionType,
        curTimestamp = Date.now();


      payloads.push({ topic: produceTopic, messages: msgValueJsonString, key: msgKey, attributes: compressionType, timestamp: curTimestamp });

      /* ProduceRequest payload format
      {
          topic: 'topicName',
          messages: ['message body'], // multi messages should be a array, single message can be just a string or a KeyedMessage instance
          key: 'theKey', // string or buffer, only needed when using keyed partitioner
          partition: 0, // default 0; 
          attributes: 2, // default: 0;  attributes: 0 = No compression, 1 = Compress using GZip, 2= Compress using snappy
          timestamp: Date.now() // <-- defaults to Date.now() (only available with kafka v0.10+)
      }   */
    }

    if (payloads.length > 0) {
      producer.send(payloads, function (err, data) {

        if (err) {
          _that.log.logerror('Failed to produce payload', err, "produceAlert", EnSeverity.critical);
          callback(err.message);
        }
        else {
          _that.log.loginfo("Produced payloads: " + JSON.stringify(payloads), "produceAlert", EnSeverity.low);
          callback(data);
        }
      });
    }
  }

  produceBadAlert(badAlertEntityArray: BadAlertModel[], callback: (result: any) => void) {

    let producer = getBadAlertProducer();
    const _that = this;


    let topicName = configuration.topic.badAlert.name,
      compressionType = configuration.topic.alert.compressionType,
      curTimestamp = Date.now();

    let payloads: {
      topic: string;
      messages: any;
      attributes: number;
      timestamp: number;
    }[] = [];

    for (var i = 0; i < badAlertEntityArray.length; i++) {
      let digestedBadAlertMessage = this.digestBadAlertMessage(badAlertEntityArray[i]);

      let msgValueJsonSting = digestedBadAlertMessage;

      payloads.push({ topic: topicName, messages: msgValueJsonSting, attributes: compressionType, timestamp: curTimestamp });
    }
    /* ProduceRequest payload format
    {
        topic: 'topicName',
        messages: ['message body'], // multi messages should be a array, single message can be just a string or a KeyedMessage instance
        key: 'theKey', // string or buffer, only needed when using keyed partitioner
        partition: 0, // default 0; 
        attributes: 2, // default: 0;  attributes: 0 = No compression, 1 = Compress using GZip, 2= Compress using snappy
        timestamp: Date.now() // <-- defaults to Date.now() (only available with kafka v0.10+)
    }   */

    if (payloads.length > 0) {
      producer.send(payloads, function (err, data) {

        if (err) {
          _that.log.logerror('Failed to produce payload', err, "produceBadAlert", EnSeverity.critical);
          callback(err.message);
        }
        else {
          _that.log.loginfo("Produced payloads: " + JSON.stringify(payloads), "produceBadAlert", EnSeverity.low);
          callback(data);
        }
      });
    }
  }

  produceEnrichedAlert(enrichedAlertEntity: EnrichedAlertModel, callback: (result: any) => void) {

    let producer = getAlertProducer();
    const _that = this;
    let produceTopic = "enriched-alert";
    let payloads: {
      topic: any;
      messages: any;
      key: any;
      attributes: any;
      timestamp: any;
    }[] = [];

    let digestedEnrichedAlertMessage = this.digestEnrichedAlertMessage(enrichedAlertEntity);

    let msgKey = digestedEnrichedAlertMessage.key,
      msgValueJsonString = digestedEnrichedAlertMessage.value,
      compressionType = configuration.topic.alert.compressionType,
      curTimestamp = Date.now();


    payloads.push({ topic: produceTopic, messages: msgValueJsonString, key: msgKey, attributes: compressionType, timestamp: curTimestamp });

    /* ProduceRequest payload format
    {
        topic: 'topicName',
        messages: ['message body'], // multi messages should be a array, single message can be just a string or a KeyedMessage instance
        key: 'theKey', // string or buffer, only needed when using keyed partitioner
        partition: 0, // default 0; 
        attributes: 2, // default: 0;  attributes: 0 = No compression, 1 = Compress using GZip, 2= Compress using snappy
        timestamp: Date.now() // <-- defaults to Date.now() (only available with kafka v0.10+)
    }   */

    if (payloads.length > 0) {
      producer.send(payloads, function (err, data) {

        if (err) {
          _that.log.logerror('Failed to produce payload', err, "produceEnrichedAlert", EnSeverity.critical);
          callback(err.message);
        }
        else {
          _that.log.loginfo("Produced payloads: " + JSON.stringify(payloads), "produceEnrichedAlert", EnSeverity.low);
          callback(data);
        }
      });
    }
  }


  digestAlertMessage(entity: AlertModel) {
    // Key
    let msgKey = entity.builderId + '_' + entity.buildingId;

    return {
      key: msgKey,
      value: JSON.stringify(entity)
    };
  }

  digestEnrichedAlertMessage(entity: EnrichedAlertModel) {
    // Key
    let msgKey = entity.alert.builderId + '_' + entity.alert.buildingId;

    return {
      key: msgKey,
      value: JSON.stringify(entity)
    };
  }

  digestBadAlertMessage(entity: BadAlertModel) {
    let msgValueJsonString =
    {
      "alertJson": entity.alertJson
      , "errorMessage": entity.reason
      , "organizationName": entity.organizationName
      , "clientId": entity.clientId
      , "producerTimestamp": entity.producerTimestamp
    };

    return JSON.stringify(msgValueJsonString);

  }
}