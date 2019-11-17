/**
 * redis database connection
 */

import { createClient, RedisClient } from 'redis';
//import { configuration } from '../libs/appconfig';
import { Logger } from '../libs/logger';
import { EnSeverity } from '../libs/enums';
import {AppError} from '../libs/apperror';

// Use this redisClient if Redis is hosted elsewhere, like in Azure Redis Cache.
// var redisClient = createClient(configuration.redisclient.port, configuration.redisclient.host,
//     {auth_pass: configuration.redisclient.auth_pass, tls: {servername: configuration.redisclient.host}});

var redisClient = createClient();

var log: Logger = new Logger('RedisConn');

redisClient.on('error', function(err){
    if (!err) {
        log.loginfo('***Redis database Connection established***',"redisClient", EnSeverity.low);
        setRedisConn(redisClient);
    }else{        
        redisClient.quit();
        new AppError(err.message, err.stack, log, "redisClient");
    }
});

export function getRedisConn(): RedisClient{
    return redisClient;
} 
export function setRedisConn(dbobj: RedisClient): void {
    redisClient = dbobj;
}