import { AlertInputModel } from '../models/alertmodel';
import { validate } from "class-validator";

export class EntityValidation {
    constructor() { };

    async ProduceAlertValidation(data: any): Promise<any[]> {
        let post = new AlertInputModel();
        let validationSummary: any[] = [];
        
        post.builderId = data.builderId;
        post.path.buildingId = data.path.buildingId;
        post.path.deviceId = data.path.deviceId;
        post.eventTimestamp = data.eventTimestamp;
        post.severity = data.severity;
        post.value = data.value;
        post.name = data.name;
        
        const errors = await validate(post);
        if (errors.length > 0) {
            for (let i = 0; i < errors.length; i++) {
                if (errors[i].constraints != null)
                    validationSummary.push(errors[i].constraints);
                for (let j = 0; j < errors[i].children.length; j++){
                    validationSummary.push(errors[i].children[j].constraints);
                }
            }
        }
        return validationSummary;
    }
}