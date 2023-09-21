import localVarRequest from 'request';

export * from './addAudienceToAudienceGroupRequest';
export * from './audience';
export * from './audienceGroup';
export * from './audienceGroupAuthorityLevel';
export * from './audienceGroupCreateRoute';
export * from './audienceGroupFailedType';
export * from './audienceGroupJob';
export * from './audienceGroupJobFailedType';
export * from './audienceGroupJobStatus';
export * from './audienceGroupJobType';
export * from './audienceGroupPermission';
export * from './audienceGroupStatus';
export * from './audienceGroupType';
export * from './createAudienceGroupRequest';
export * from './createAudienceGroupResponse';
export * from './createClickBasedAudienceGroupRequest';
export * from './createClickBasedAudienceGroupResponse';
export * from './createImpBasedAudienceGroupRequest';
export * from './createImpBasedAudienceGroupResponse';
export * from './errorDetail';
export * from './errorResponse';
export * from './getAudienceDataResponse';
export * from './getAudienceGroupAuthorityLevelResponse';
export * from './getAudienceGroupsResponse';
export * from './updateAudienceGroupAuthorityLevelRequest';
export * from './updateAudienceGroupDescriptionRequest';

import * as fs from 'fs';

export interface RequestDetailedFile {
    value: Buffer;
    options?: {
        filename?: string;
        contentType?: string;
    }
}

export type RequestFile = string | Buffer | fs.ReadStream | RequestDetailedFile;


import { AddAudienceToAudienceGroupRequest } from './addAudienceToAudienceGroupRequest';
import { Audience } from './audience';
import { AudienceGroup } from './audienceGroup';
import { AudienceGroupAuthorityLevel } from './audienceGroupAuthorityLevel';
import { AudienceGroupCreateRoute } from './audienceGroupCreateRoute';
import { AudienceGroupFailedType } from './audienceGroupFailedType';
import { AudienceGroupJob } from './audienceGroupJob';
import { AudienceGroupJobFailedType } from './audienceGroupJobFailedType';
import { AudienceGroupJobStatus } from './audienceGroupJobStatus';
import { AudienceGroupJobType } from './audienceGroupJobType';
import { AudienceGroupPermission } from './audienceGroupPermission';
import { AudienceGroupStatus } from './audienceGroupStatus';
import { AudienceGroupType } from './audienceGroupType';
import { CreateAudienceGroupRequest } from './createAudienceGroupRequest';
import { CreateAudienceGroupResponse } from './createAudienceGroupResponse';
import { CreateClickBasedAudienceGroupRequest } from './createClickBasedAudienceGroupRequest';
import { CreateClickBasedAudienceGroupResponse } from './createClickBasedAudienceGroupResponse';
import { CreateImpBasedAudienceGroupRequest } from './createImpBasedAudienceGroupRequest';
import { CreateImpBasedAudienceGroupResponse } from './createImpBasedAudienceGroupResponse';
import { ErrorDetail } from './errorDetail';
import { ErrorResponse } from './errorResponse';
import { GetAudienceDataResponse } from './getAudienceDataResponse';
import { GetAudienceGroupAuthorityLevelResponse } from './getAudienceGroupAuthorityLevelResponse';
import { GetAudienceGroupsResponse } from './getAudienceGroupsResponse';
import { UpdateAudienceGroupAuthorityLevelRequest } from './updateAudienceGroupAuthorityLevelRequest';
import { UpdateAudienceGroupDescriptionRequest } from './updateAudienceGroupDescriptionRequest';

/* tslint:disable:no-unused-variable */
let primitives = [
                    "string",
                    "boolean",
                    "double",
                    "integer",
                    "long",
                    "float",
                    "number",
                    "any"
                 ];

let enumsMap: {[index: string]: any} = {
        "AudienceGroupAuthorityLevel": AudienceGroupAuthorityLevel,
        "AudienceGroupCreateRoute": AudienceGroupCreateRoute,
        "AudienceGroupFailedType": AudienceGroupFailedType,
        "AudienceGroupJobFailedType": AudienceGroupJobFailedType,
        "AudienceGroupJobStatus": AudienceGroupJobStatus,
        "AudienceGroupJobType": AudienceGroupJobType,
        "AudienceGroupPermission": AudienceGroupPermission,
        "AudienceGroupStatus": AudienceGroupStatus,
        "AudienceGroupType": AudienceGroupType,
        "CreateAudienceGroupResponse.CreateRouteEnum": CreateAudienceGroupResponse.CreateRouteEnum,
        "CreateAudienceGroupResponse.PermissionEnum": CreateAudienceGroupResponse.PermissionEnum,
        "CreateClickBasedAudienceGroupResponse.CreateRouteEnum": CreateClickBasedAudienceGroupResponse.CreateRouteEnum,
        "CreateClickBasedAudienceGroupResponse.PermissionEnum": CreateClickBasedAudienceGroupResponse.PermissionEnum,
}

let typeMap: {[index: string]: any} = {
    "AddAudienceToAudienceGroupRequest": AddAudienceToAudienceGroupRequest,
    "Audience": Audience,
    "AudienceGroup": AudienceGroup,
    "AudienceGroupJob": AudienceGroupJob,
    "CreateAudienceGroupRequest": CreateAudienceGroupRequest,
    "CreateAudienceGroupResponse": CreateAudienceGroupResponse,
    "CreateClickBasedAudienceGroupRequest": CreateClickBasedAudienceGroupRequest,
    "CreateClickBasedAudienceGroupResponse": CreateClickBasedAudienceGroupResponse,
    "CreateImpBasedAudienceGroupRequest": CreateImpBasedAudienceGroupRequest,
    "CreateImpBasedAudienceGroupResponse": CreateImpBasedAudienceGroupResponse,
    "ErrorDetail": ErrorDetail,
    "ErrorResponse": ErrorResponse,
    "GetAudienceDataResponse": GetAudienceDataResponse,
    "GetAudienceGroupAuthorityLevelResponse": GetAudienceGroupAuthorityLevelResponse,
    "GetAudienceGroupsResponse": GetAudienceGroupsResponse,
    "UpdateAudienceGroupAuthorityLevelRequest": UpdateAudienceGroupAuthorityLevelRequest,
    "UpdateAudienceGroupDescriptionRequest": UpdateAudienceGroupDescriptionRequest,
}

export class ObjectSerializer {
    public static findCorrectType(data: any, expectedType: string) {
        if (data == undefined) {
            return expectedType;
        } else if (primitives.indexOf(expectedType.toLowerCase()) !== -1) {
            return expectedType;
        } else if (expectedType === "Date") {
            return expectedType;
        } else {
            if (enumsMap[expectedType]) {
                return expectedType;
            }

            if (!typeMap[expectedType]) {
                return expectedType; // w/e we don't know the type
            }

            // Check the discriminator
            let discriminatorProperty = typeMap[expectedType].discriminator;
            if (discriminatorProperty == null) {
                return expectedType; // the type does not have a discriminator. use it.
            } else {
                if (data[discriminatorProperty]) {
                    var discriminatorType = data[discriminatorProperty];
                    if(typeMap[discriminatorType]){
                        return discriminatorType; // use the type given in the discriminator
                    } else {
                        return expectedType; // discriminator did not map to a type
                    }
                } else {
                    return expectedType; // discriminator was not present (or an empty string)
                }
            }
        }
    }

    public static serialize(data: any, type: string) {
        if (data == undefined) {
            return data;
        } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        } else if (type.lastIndexOf("Array<", 0) === 0) { // string.startsWith pre es6
            let subType: string = type.replace("Array<", ""); // Array<Type> => Type>
            subType = subType.substring(0, subType.length - 1); // Type> => Type
            let transformedData: any[] = [];
            for (let index = 0; index < data.length; index++) {
                let datum = data[index];
                transformedData.push(ObjectSerializer.serialize(datum, subType));
            }
            return transformedData;
        } else if (type === "Date") {
            return data.toISOString();
        } else {
            if (enumsMap[type]) {
                return data;
            }
            if (!typeMap[type]) { // in case we dont know the type
                return data;
            }

            // Get the actual type of this object
            type = this.findCorrectType(data, type);

            // get the map for the correct type.
            let attributeTypes = typeMap[type].getAttributeTypeMap();
            let instance: {[index: string]: any} = {};
            for (let index = 0; index < attributeTypes.length; index++) {
                let attributeType = attributeTypes[index];
                instance[attributeType.baseName] = ObjectSerializer.serialize(data[attributeType.name], attributeType.type);
            }
            return instance;
        }
    }

    public static deserialize(data: any, type: string) {
        // polymorphism may change the actual type.
        type = ObjectSerializer.findCorrectType(data, type);
        if (data == undefined) {
            return data;
        } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        } else if (type.lastIndexOf("Array<", 0) === 0) { // string.startsWith pre es6
            let subType: string = type.replace("Array<", ""); // Array<Type> => Type>
            subType = subType.substring(0, subType.length - 1); // Type> => Type
            let transformedData: any[] = [];
            for (let index = 0; index < data.length; index++) {
                let datum = data[index];
                transformedData.push(ObjectSerializer.deserialize(datum, subType));
            }
            return transformedData;
        } else if (type === "Date") {
            return new Date(data);
        } else {
            if (enumsMap[type]) {// is Enum
                return data;
            }

            if (!typeMap[type]) { // dont know the type
                return data;
            }
            let instance = new typeMap[type]();
            let attributeTypes = typeMap[type].getAttributeTypeMap();
            for (let index = 0; index < attributeTypes.length; index++) {
                let attributeType = attributeTypes[index];
                instance[attributeType.name] = ObjectSerializer.deserialize(data[attributeType.baseName], attributeType.type);
            }
            return instance;
        }
    }
}

export interface Authentication {
    /**
    * Apply authentication settings to header and query params.
    */
    applyToRequest(requestOptions: localVarRequest.Options): Promise<void> | void;
}

export class HttpBasicAuth implements Authentication {
    public username: string = '';
    public password: string = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        requestOptions.auth = {
            username: this.username, password: this.password
        }
    }
}

export class HttpBearerAuth implements Authentication {
    public accessToken: string | (() => string) = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (requestOptions && requestOptions.headers) {
            const accessToken = typeof this.accessToken === 'function'
                            ? this.accessToken()
                            : this.accessToken;
            requestOptions.headers["Authorization"] = "Bearer " + accessToken;
        }
    }
}

export class ApiKeyAuth implements Authentication {
    public apiKey: string = '';

    constructor(private location: string, private paramName: string) {
    }

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (this.location == "query") {
            (<any>requestOptions.qs)[this.paramName] = this.apiKey;
        } else if (this.location == "header" && requestOptions && requestOptions.headers) {
            requestOptions.headers[this.paramName] = this.apiKey;
        } else if (this.location == 'cookie' && requestOptions && requestOptions.headers) {
            if (requestOptions.headers['Cookie']) {
                requestOptions.headers['Cookie'] += '; ' + this.paramName + '=' + encodeURIComponent(this.apiKey);
            }
            else {
                requestOptions.headers['Cookie'] = this.paramName + '=' + encodeURIComponent(this.apiKey);
            }
        }
    }
}

export class OAuth implements Authentication {
    public accessToken: string = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (requestOptions && requestOptions.headers) {
            requestOptions.headers["Authorization"] = "Bearer " + this.accessToken;
        }
    }
}

export class VoidAuth implements Authentication {
    public username: string = '';
    public password: string = '';

    applyToRequest(_: localVarRequest.Options): void {
        // Do nothing
    }
}

export type Interceptor = (requestOptions: localVarRequest.Options) => (Promise<void> | void);
