import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { isGuid } from '../validations/validation';

@ValidatorConstraint({ name: "Guid", async: false })
export class ValidateGuid implements ValidatorConstraintInterface {

    validate(text: string) {

        if(text == "00000000-0000-0000-0000-000000000000") return false;

        return isGuid(text); // for async validations you must return a Promise<boolean> here
    }

    defaultMessage() { // here you can provide default error message if validation failed
        return "Must be valid Guid";
    }
}

@ValidatorConstraint({ name: "EmptyGuid", async: false })
export class IsEmptyOrValidGuid implements ValidatorConstraintInterface {
    validate(text: string) {

        if(text == undefined || text == "" || text == null) return true;

            return isGuid(text);        
        // for async validations you must return a Promise<boolean> here
    }

    defaultMessage() { // here you can provide default error message if validation failed
        return "Must be valid Guid";
    }
}

@ValidatorConstraint({ name: "Mobile", async: false })
export class ValidateMobile implements ValidatorConstraintInterface {

    validate(phone: string) {

        var regex = /^(?:[0-9] ?){6,14}[0-9]$/;

        if (regex.test(phone)) {
            return true;
        } else {
            return false
        }       
    }

    defaultMessage() { // here you can provide default error message if validation failed
        return "is not valid number";
    }
}