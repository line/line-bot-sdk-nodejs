/**
 * LINE Messaging API(Insight)
 * This document describes LINE Messaging API(Insight).
 *
 * The version of the OpenAPI document: 0.0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export type AgeTile =  { 
    /**
    * users\' age
    */
    'age'?: AgeTile.AgeEnum/**/;
    /**
    * Percentage
    */
    'percentage'?: number/**/;
}

export namespace AgeTile {
    export enum AgeEnum {
        From0to14 = <any> 'from0to14',
        From15to19 = <any> 'from15to19',
        From20to24 = <any> 'from20to24',
        From25to29 = <any> 'from25to29',
        From30to34 = <any> 'from30to34',
        From35to39 = <any> 'from35to39',
        From40to44 = <any> 'from40to44',
        From45to49 = <any> 'from45to49',
        From50 = <any> 'from50',
        Unknown = <any> 'unknown'
    }
}