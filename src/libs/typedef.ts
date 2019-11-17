/**
 * custom types
 */
export interface IConfiguration {  // FE
    https: boolean;
    httpport: number;
    httpsport: number;
    kafkaClient: {
        kafkaHost: string,
        maxAsyncRequests: number,
        requestTimeout: number,
        connectTimeout: number
    };
    producer: {
        alert: {
            requireAcks: number,
            ackTimeoutMs: number,
            partitionerType: number
        },
        badAlert: {
            requireAcks: number,
            ackTimeoutMs: number,
            partitionerType: number
        }
    };
    topic: {
        alert: {
            name: string,
            numPartitions: number,
            partition: number,
            compressionType: number
        }
        badAlert: {
            name: string,
            numPartitions: number,
            partition: number,
            compressionType: number
        }
    };
    streams: {
        zkConStr: string,
        kafkaHost: string,
        groupId: string,
        clientName: string,
        workerPerPartition: number,
        options: {
            sessionTimeout: 8000,
            protocol: string,
            fromOffset: string,
            fetchMaxBytes: number,
            fetchMinBytes: number,
            fetchMaxWaitMs: number,
            heartbeatInterval: number,
            retryMinTimeout: number,
            autoCommit: boolean,
            autoCommitIntervalMs: number,
            requireAcks: number,
            ackTimeoutMs: number,
            partitionerType: number
        }
    };
    redisclient: {
        port: number,
        host: string,
        auth_pass: string      
    };
    applicationname:string;
    log: {
        path: string;
        env: number; 
        logging:string; 
        url:string;      
    };
}
