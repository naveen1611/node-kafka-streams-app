import { Guid } from "guid-typescript";
import { strEmpty } from "../libs/constants";
import { IsString, IsNotEmpty, Validate, ValidateNested } from "class-validator";
import { ValidateGuid } from "../validations/validateGuid";

export class AlertModel{

    public builderId: Guid = Guid.createEmpty();    
    public buildingId: Guid = Guid.createEmpty();
    public deviceId: Guid = Guid.createEmpty();
    public eventTimestamp: string = strEmpty;
    public severity: string = strEmpty;
    public value: string = strEmpty;
    public name: string = strEmpty;
    public producerTimestamp: string = strEmpty;
}

export class AlertInputModel{

    @IsNotEmpty()
    @Validate(ValidateGuid, {
        message: "organizationId must be Guid"
    })
    public builderId: Guid = Guid.createEmpty();

    @ValidateNested()
    public path: Path = new Path();    

    @IsNotEmpty()
    @IsString()
    public eventTimestamp: string = strEmpty;

    @IsNotEmpty()
    @IsString()
    public severity: string = strEmpty;
    
    @IsNotEmpty()
    @IsString()
    public value: string = strEmpty;   

    @IsString()
    public name: string = strEmpty;
}

export class Path {
    @IsNotEmpty()
    @Validate(ValidateGuid, {
        message: "buildingId must be Guid"
    })
    public buildingId: Guid = Guid.createEmpty();
    
    @IsNotEmpty()
    @Validate(ValidateGuid, {
        message: "deviceId must be Guid"
    })
    public deviceId: Guid = Guid.createEmpty();    
}

export class AlertResponseModel {
    status: number = 500;
    error: any = null;
    name: any = null;
    data: any = null;
}

export class User {
    userId: string = strEmpty;
    phone: string = strEmpty;
    email: string = strEmpty;
}

export class DeviceUser {
    userId: string = strEmpty;
    deviceId: string = strEmpty;
}

export class EnrichedAlertModel {
    alert: AlertModel = new AlertModel();
    users: User[] = [];
}
