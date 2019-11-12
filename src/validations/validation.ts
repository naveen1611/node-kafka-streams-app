import { Guid } from "guid-typescript";

export function isGuid(input: string): boolean{
   if(!input) return false;
   if(input=='') return false;

   let isValid: boolean =  Guid.isGuid(input);

   return isValid;
} 

export function isGuidEmpty(input: Guid): boolean{
    
   let isValid: boolean =  input.isEmpty();

   return isValid;
} 