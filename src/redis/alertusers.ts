import { RedisClient } from 'redis';
import { getRedisConn } from './redisconn';
import { Constant } from '../libs/constants';
import { Logger } from '../libs/logger';
import { EnSeverity } from '../libs/enums';
import { AlertModel, User, DeviceUser } from '../models/alertmodel';


let client: RedisClient = getRedisConn();

export class AlertUsers {

  private log: Logger = new Logger('Alert');
  constructor() { }


  getAlertUsers(alert: AlertModel, callback: (result: any) => void) {
    const _that = this;
    //let DeviceUser: DeviceUser

    let key = Constant.UserKeyName + alert.builderId.toString().toUpperCase() + ":" + alert.buildingId.toString().toUpperCase();
    let deviceId = alert.deviceId.toString().toUpperCase();
    //let key = 'Users:50000001-6056-4A71-9428-005C98FDBF3B:60000001-6056-4A71-9428-005C98FDBF3B';
    //let deviceId = "2001";

    client.hgetall(key, function (err, result) {
      if (err) {
        console.log(`getting exception: ${err.message} for buildingId: ${alert.buildingId} and builderId: ${alert.builderId}`);
      } else {
        _that.log.loginfo("Get Alert Users for buildingId: " + alert.buildingId + " and builderId: " + alert.builderId, "getAlertUsers", EnSeverity.low);
        if (result != null) {
          //console.log('result: ', result);
          var devicesJson = result.Device;
          var devices: DeviceUser[] = JSON.parse(devicesJson);
          //console.log('devices: ', devices);
          var usersJson = result.User;
          var users: User[] = JSON.parse(usersJson);
          //console.log('users: ', users);

          let filteredDevices = devices.filter(x => x.deviceId.trim() == deviceId);
          //console.log('filteredDevices: ', filteredDevices);

          let filteredUsers: User[] = [];
          let finalUsers: User[] = [];
          filteredDevices.forEach(device => {
            filteredUsers = users.filter(x => x.userId == device.userId);
            filteredUsers.forEach(user => {
              finalUsers.push(user);
            })
          });
          //console.log('-----------finalUsers-----------');
          //console.log(finalUsers);

          callback(finalUsers);
        }
        else {
          _that.log.loginfo("No Users mapped for builderId: " + alert.builderId.toString().toUpperCase() + ", buildingId: " + alert.buildingId.toString().toUpperCase() + " and deviceId: " + alert.deviceId.toString().toUpperCase(), "getAlertUsers", EnSeverity.low);
          console.log("No Users mapped for builderId: " + alert.builderId.toString().toUpperCase() + ", buildingId: " + alert.buildingId.toString().toUpperCase() + " and deviceId: " + alert.deviceId.toString().toUpperCase());
          callback(Constant.NoUserFound);
        }
      }
    });
  }


}