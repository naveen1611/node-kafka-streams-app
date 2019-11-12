import { AlertInputModel } from '../models/alertmodel';
import { strEmpty } from "../libs/constants";

export class BadAlertModel
{
    public producerTimestamp: string = strEmpty;
    public alertJson = new AlertInputModel();
    public reason: string = strEmpty;
    public organizationName: string = 'Org1';
    public clientId: string = 'Client1';    
}

export class BadAlertProcessingModel {
    public organizationName: string = strEmpty;
    public clientId: string = strEmpty;
    public badAlertTime: string = strEmpty;
    public alertJson: string = strEmpty;
    public reason: string = strEmpty;
}