import localVarRequest from 'request';

export * from './action';
export * from './ageDemographic';
export * from './ageDemographicFilter';
export * from './altUri';
export * from './appTypeDemographic';
export * from './appTypeDemographicFilter';
export * from './areaDemographic';
export * from './areaDemographicFilter';
export * from './audienceMatchMessagesRequest';
export * from './audienceRecipient';
export * from './audioMessage';
export * from './botInfoResponse';
export * from './broadcastRequest';
export * from './buttonsTemplate';
export * from './cameraAction';
export * from './cameraRollAction';
export * from './carouselColumn';
export * from './carouselTemplate';
export * from './chatReference';
export * from './confirmTemplate';
export * from './createRichMenuAliasRequest';
export * from './datetimePickerAction';
export * from './demographicFilter';
export * from './emoji';
export * from './errorDetail';
export * from './errorResponse';
export * from './filter';
export * from './flexBlockStyle';
export * from './flexBox';
export * from './flexBoxBackground';
export * from './flexBoxLinearGradient';
export * from './flexBubble';
export * from './flexBubbleStyles';
export * from './flexButton';
export * from './flexCarousel';
export * from './flexComponent';
export * from './flexContainer';
export * from './flexFiller';
export * from './flexIcon';
export * from './flexImage';
export * from './flexMessage';
export * from './flexSeparator';
export * from './flexSpan';
export * from './flexText';
export * from './flexVideo';
export * from './genderDemographic';
export * from './genderDemographicFilter';
export * from './getAggregationUnitNameListResponse';
export * from './getAggregationUnitUsageResponse';
export * from './getFollowersResponse';
export * from './getMessageContentTranscodingResponse';
export * from './getWebhookEndpointResponse';
export * from './groupMemberCountResponse';
export * from './groupSummaryResponse';
export * from './groupUserProfileResponse';
export * from './imageCarouselColumn';
export * from './imageCarouselTemplate';
export * from './imageMessage';
export * from './imagemapAction';
export * from './imagemapArea';
export * from './imagemapBaseSize';
export * from './imagemapExternalLink';
export * from './imagemapMessage';
export * from './imagemapVideo';
export * from './issueLinkTokenResponse';
export * from './limit';
export * from './locationAction';
export * from './locationMessage';
export * from './markMessagesAsReadRequest';
export * from './membersIdsResponse';
export * from './message';
export * from './messageAction';
export * from './messageImagemapAction';
export * from './messageQuotaResponse';
export * from './multicastRequest';
export * from './narrowcastProgressResponse';
export * from './narrowcastRequest';
export * from './numberOfMessagesResponse';
export * from './operatorDemographicFilter';
export * from './operatorRecipient';
export * from './pnpMessagesRequest';
export * from './postbackAction';
export * from './pushMessageRequest';
export * from './pushMessageResponse';
export * from './quickReply';
export * from './quickReplyItem';
export * from './quotaConsumptionResponse';
export * from './quotaType';
export * from './recipient';
export * from './redeliveryRecipient';
export * from './replyMessageRequest';
export * from './replyMessageResponse';
export * from './richMenuAliasListResponse';
export * from './richMenuAliasResponse';
export * from './richMenuArea';
export * from './richMenuBatchLinkOperation';
export * from './richMenuBatchOperation';
export * from './richMenuBatchProgressPhase';
export * from './richMenuBatchProgressResponse';
export * from './richMenuBatchRequest';
export * from './richMenuBatchUnlinkAllOperation';
export * from './richMenuBatchUnlinkOperation';
export * from './richMenuBounds';
export * from './richMenuBulkLinkRequest';
export * from './richMenuBulkUnlinkRequest';
export * from './richMenuIdResponse';
export * from './richMenuListResponse';
export * from './richMenuRequest';
export * from './richMenuResponse';
export * from './richMenuSize';
export * from './richMenuSwitchAction';
export * from './roomMemberCountResponse';
export * from './roomUserProfileResponse';
export * from './sender';
export * from './sentMessage';
export * from './setWebhookEndpointRequest';
export * from './stickerMessage';
export * from './subscriptionPeriodDemographic';
export * from './subscriptionPeriodDemographicFilter';
export * from './template';
export * from './templateMessage';
export * from './testWebhookEndpointRequest';
export * from './testWebhookEndpointResponse';
export * from './textMessage';
export * from './uRIAction';
export * from './uRIImagemapAction';
export * from './updateRichMenuAliasRequest';
export * from './userProfileResponse';
export * from './validateMessageRequest';
export * from './videoMessage';

import * as fs from 'fs';

export interface RequestDetailedFile {
    value: Buffer;
    options?: {
        filename?: string;
        contentType?: string;
    }
}

export type RequestFile = string | Buffer | fs.ReadStream | RequestDetailedFile;


import { Action } from './action';
import { AgeDemographic } from './ageDemographic';
import { AgeDemographicFilter } from './ageDemographicFilter';
import { AltUri } from './altUri';
import { AppTypeDemographic } from './appTypeDemographic';
import { AppTypeDemographicFilter } from './appTypeDemographicFilter';
import { AreaDemographic } from './areaDemographic';
import { AreaDemographicFilter } from './areaDemographicFilter';
import { AudienceMatchMessagesRequest } from './audienceMatchMessagesRequest';
import { AudienceRecipient } from './audienceRecipient';
import { AudioMessage } from './audioMessage';
import { BotInfoResponse } from './botInfoResponse';
import { BroadcastRequest } from './broadcastRequest';
import { ButtonsTemplate } from './buttonsTemplate';
import { CameraAction } from './cameraAction';
import { CameraRollAction } from './cameraRollAction';
import { CarouselColumn } from './carouselColumn';
import { CarouselTemplate } from './carouselTemplate';
import { ChatReference } from './chatReference';
import { ConfirmTemplate } from './confirmTemplate';
import { CreateRichMenuAliasRequest } from './createRichMenuAliasRequest';
import { DatetimePickerAction } from './datetimePickerAction';
import { DemographicFilter } from './demographicFilter';
import { Emoji } from './emoji';
import { ErrorDetail } from './errorDetail';
import { ErrorResponse } from './errorResponse';
import { Filter } from './filter';
import { FlexBlockStyle } from './flexBlockStyle';
import { FlexBox } from './flexBox';
import { FlexBoxBackground } from './flexBoxBackground';
import { FlexBoxLinearGradient } from './flexBoxLinearGradient';
import { FlexBubble } from './flexBubble';
import { FlexBubbleStyles } from './flexBubbleStyles';
import { FlexButton } from './flexButton';
import { FlexCarousel } from './flexCarousel';
import { FlexComponent } from './flexComponent';
import { FlexContainer } from './flexContainer';
import { FlexFiller } from './flexFiller';
import { FlexIcon } from './flexIcon';
import { FlexImage } from './flexImage';
import { FlexMessage } from './flexMessage';
import { FlexSeparator } from './flexSeparator';
import { FlexSpan } from './flexSpan';
import { FlexText } from './flexText';
import { FlexVideo } from './flexVideo';
import { GenderDemographic } from './genderDemographic';
import { GenderDemographicFilter } from './genderDemographicFilter';
import { GetAggregationUnitNameListResponse } from './getAggregationUnitNameListResponse';
import { GetAggregationUnitUsageResponse } from './getAggregationUnitUsageResponse';
import { GetFollowersResponse } from './getFollowersResponse';
import { GetMessageContentTranscodingResponse } from './getMessageContentTranscodingResponse';
import { GetWebhookEndpointResponse } from './getWebhookEndpointResponse';
import { GroupMemberCountResponse } from './groupMemberCountResponse';
import { GroupSummaryResponse } from './groupSummaryResponse';
import { GroupUserProfileResponse } from './groupUserProfileResponse';
import { ImageCarouselColumn } from './imageCarouselColumn';
import { ImageCarouselTemplate } from './imageCarouselTemplate';
import { ImageMessage } from './imageMessage';
import { ImagemapAction } from './imagemapAction';
import { ImagemapArea } from './imagemapArea';
import { ImagemapBaseSize } from './imagemapBaseSize';
import { ImagemapExternalLink } from './imagemapExternalLink';
import { ImagemapMessage } from './imagemapMessage';
import { ImagemapVideo } from './imagemapVideo';
import { IssueLinkTokenResponse } from './issueLinkTokenResponse';
import { Limit } from './limit';
import { LocationAction } from './locationAction';
import { LocationMessage } from './locationMessage';
import { MarkMessagesAsReadRequest } from './markMessagesAsReadRequest';
import { MembersIdsResponse } from './membersIdsResponse';
import { Message } from './message';
import { MessageAction } from './messageAction';
import { MessageImagemapAction } from './messageImagemapAction';
import { MessageQuotaResponse } from './messageQuotaResponse';
import { MulticastRequest } from './multicastRequest';
import { NarrowcastProgressResponse } from './narrowcastProgressResponse';
import { NarrowcastRequest } from './narrowcastRequest';
import { NumberOfMessagesResponse } from './numberOfMessagesResponse';
import { OperatorDemographicFilter } from './operatorDemographicFilter';
import { OperatorRecipient } from './operatorRecipient';
import { PnpMessagesRequest } from './pnpMessagesRequest';
import { PostbackAction } from './postbackAction';
import { PushMessageRequest } from './pushMessageRequest';
import { PushMessageResponse } from './pushMessageResponse';
import { QuickReply } from './quickReply';
import { QuickReplyItem } from './quickReplyItem';
import { QuotaConsumptionResponse } from './quotaConsumptionResponse';
import { QuotaType } from './quotaType';
import { Recipient } from './recipient';
import { RedeliveryRecipient } from './redeliveryRecipient';
import { ReplyMessageRequest } from './replyMessageRequest';
import { ReplyMessageResponse } from './replyMessageResponse';
import { RichMenuAliasListResponse } from './richMenuAliasListResponse';
import { RichMenuAliasResponse } from './richMenuAliasResponse';
import { RichMenuArea } from './richMenuArea';
import { RichMenuBatchLinkOperation } from './richMenuBatchLinkOperation';
import { RichMenuBatchOperation } from './richMenuBatchOperation';
import { RichMenuBatchProgressPhase } from './richMenuBatchProgressPhase';
import { RichMenuBatchProgressResponse } from './richMenuBatchProgressResponse';
import { RichMenuBatchRequest } from './richMenuBatchRequest';
import { RichMenuBatchUnlinkAllOperation } from './richMenuBatchUnlinkAllOperation';
import { RichMenuBatchUnlinkOperation } from './richMenuBatchUnlinkOperation';
import { RichMenuBounds } from './richMenuBounds';
import { RichMenuBulkLinkRequest } from './richMenuBulkLinkRequest';
import { RichMenuBulkUnlinkRequest } from './richMenuBulkUnlinkRequest';
import { RichMenuIdResponse } from './richMenuIdResponse';
import { RichMenuListResponse } from './richMenuListResponse';
import { RichMenuRequest } from './richMenuRequest';
import { RichMenuResponse } from './richMenuResponse';
import { RichMenuSize } from './richMenuSize';
import { RichMenuSwitchAction } from './richMenuSwitchAction';
import { RoomMemberCountResponse } from './roomMemberCountResponse';
import { RoomUserProfileResponse } from './roomUserProfileResponse';
import { Sender } from './sender';
import { SentMessage } from './sentMessage';
import { SetWebhookEndpointRequest } from './setWebhookEndpointRequest';
import { StickerMessage } from './stickerMessage';
import { SubscriptionPeriodDemographic } from './subscriptionPeriodDemographic';
import { SubscriptionPeriodDemographicFilter } from './subscriptionPeriodDemographicFilter';
import { Template } from './template';
import { TemplateMessage } from './templateMessage';
import { TestWebhookEndpointRequest } from './testWebhookEndpointRequest';
import { TestWebhookEndpointResponse } from './testWebhookEndpointResponse';
import { TextMessage } from './textMessage';
import { URIAction } from './uRIAction';
import { URIImagemapAction } from './uRIImagemapAction';
import { UpdateRichMenuAliasRequest } from './updateRichMenuAliasRequest';
import { UserProfileResponse } from './userProfileResponse';
import { ValidateMessageRequest } from './validateMessageRequest';
import { VideoMessage } from './videoMessage';

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
        "AgeDemographic": AgeDemographic,
        "AppTypeDemographic": AppTypeDemographic,
        "AreaDemographic": AreaDemographic,
        "BotInfoResponse.ChatModeEnum": BotInfoResponse.ChatModeEnum,
        "BotInfoResponse.MarkAsReadModeEnum": BotInfoResponse.MarkAsReadModeEnum,
        "DatetimePickerAction.ModeEnum": DatetimePickerAction.ModeEnum,
        "FlexBox.LayoutEnum": FlexBox.LayoutEnum,
        "FlexBox.PositionEnum": FlexBox.PositionEnum,
        "FlexBox.JustifyContentEnum": FlexBox.JustifyContentEnum,
        "FlexBox.AlignItemsEnum": FlexBox.AlignItemsEnum,
        "FlexBubble.DirectionEnum": FlexBubble.DirectionEnum,
        "FlexBubble.SizeEnum": FlexBubble.SizeEnum,
        "FlexButton.StyleEnum": FlexButton.StyleEnum,
        "FlexButton.GravityEnum": FlexButton.GravityEnum,
        "FlexButton.PositionEnum": FlexButton.PositionEnum,
        "FlexButton.HeightEnum": FlexButton.HeightEnum,
        "FlexButton.AdjustModeEnum": FlexButton.AdjustModeEnum,
        "FlexIcon.PositionEnum": FlexIcon.PositionEnum,
        "FlexImage.PositionEnum": FlexImage.PositionEnum,
        "FlexImage.AlignEnum": FlexImage.AlignEnum,
        "FlexImage.GravityEnum": FlexImage.GravityEnum,
        "FlexImage.AspectModeEnum": FlexImage.AspectModeEnum,
        "FlexSpan.WeightEnum": FlexSpan.WeightEnum,
        "FlexSpan.StyleEnum": FlexSpan.StyleEnum,
        "FlexSpan.DecorationEnum": FlexSpan.DecorationEnum,
        "FlexText.AlignEnum": FlexText.AlignEnum,
        "FlexText.GravityEnum": FlexText.GravityEnum,
        "FlexText.WeightEnum": FlexText.WeightEnum,
        "FlexText.StyleEnum": FlexText.StyleEnum,
        "FlexText.DecorationEnum": FlexText.DecorationEnum,
        "FlexText.PositionEnum": FlexText.PositionEnum,
        "FlexText.AdjustModeEnum": FlexText.AdjustModeEnum,
        "GenderDemographic": GenderDemographic,
        "GetMessageContentTranscodingResponse.StatusEnum": GetMessageContentTranscodingResponse.StatusEnum,
        "NarrowcastProgressResponse.PhaseEnum": NarrowcastProgressResponse.PhaseEnum,
        "NumberOfMessagesResponse.StatusEnum": NumberOfMessagesResponse.StatusEnum,
        "PostbackAction.InputOptionEnum": PostbackAction.InputOptionEnum,
        "QuotaType": QuotaType,
        "RichMenuBatchProgressPhase": RichMenuBatchProgressPhase,
        "SubscriptionPeriodDemographic": SubscriptionPeriodDemographic,
}

let typeMap: {[index: string]: any} = {
    "Action": Action,
    "AgeDemographicFilter": AgeDemographicFilter,
    "AltUri": AltUri,
    "AppTypeDemographicFilter": AppTypeDemographicFilter,
    "AreaDemographicFilter": AreaDemographicFilter,
    "AudienceMatchMessagesRequest": AudienceMatchMessagesRequest,
    "AudienceRecipient": AudienceRecipient,
    "AudioMessage": AudioMessage,
    "BotInfoResponse": BotInfoResponse,
    "BroadcastRequest": BroadcastRequest,
    "ButtonsTemplate": ButtonsTemplate,
    "CameraAction": CameraAction,
    "CameraRollAction": CameraRollAction,
    "CarouselColumn": CarouselColumn,
    "CarouselTemplate": CarouselTemplate,
    "ChatReference": ChatReference,
    "ConfirmTemplate": ConfirmTemplate,
    "CreateRichMenuAliasRequest": CreateRichMenuAliasRequest,
    "DatetimePickerAction": DatetimePickerAction,
    "DemographicFilter": DemographicFilter,
    "Emoji": Emoji,
    "ErrorDetail": ErrorDetail,
    "ErrorResponse": ErrorResponse,
    "Filter": Filter,
    "FlexBlockStyle": FlexBlockStyle,
    "FlexBox": FlexBox,
    "FlexBoxBackground": FlexBoxBackground,
    "FlexBoxLinearGradient": FlexBoxLinearGradient,
    "FlexBubble": FlexBubble,
    "FlexBubbleStyles": FlexBubbleStyles,
    "FlexButton": FlexButton,
    "FlexCarousel": FlexCarousel,
    "FlexComponent": FlexComponent,
    "FlexContainer": FlexContainer,
    "FlexFiller": FlexFiller,
    "FlexIcon": FlexIcon,
    "FlexImage": FlexImage,
    "FlexMessage": FlexMessage,
    "FlexSeparator": FlexSeparator,
    "FlexSpan": FlexSpan,
    "FlexText": FlexText,
    "FlexVideo": FlexVideo,
    "GenderDemographicFilter": GenderDemographicFilter,
    "GetAggregationUnitNameListResponse": GetAggregationUnitNameListResponse,
    "GetAggregationUnitUsageResponse": GetAggregationUnitUsageResponse,
    "GetFollowersResponse": GetFollowersResponse,
    "GetMessageContentTranscodingResponse": GetMessageContentTranscodingResponse,
    "GetWebhookEndpointResponse": GetWebhookEndpointResponse,
    "GroupMemberCountResponse": GroupMemberCountResponse,
    "GroupSummaryResponse": GroupSummaryResponse,
    "GroupUserProfileResponse": GroupUserProfileResponse,
    "ImageCarouselColumn": ImageCarouselColumn,
    "ImageCarouselTemplate": ImageCarouselTemplate,
    "ImageMessage": ImageMessage,
    "ImagemapAction": ImagemapAction,
    "ImagemapArea": ImagemapArea,
    "ImagemapBaseSize": ImagemapBaseSize,
    "ImagemapExternalLink": ImagemapExternalLink,
    "ImagemapMessage": ImagemapMessage,
    "ImagemapVideo": ImagemapVideo,
    "IssueLinkTokenResponse": IssueLinkTokenResponse,
    "Limit": Limit,
    "LocationAction": LocationAction,
    "LocationMessage": LocationMessage,
    "MarkMessagesAsReadRequest": MarkMessagesAsReadRequest,
    "MembersIdsResponse": MembersIdsResponse,
    "Message": Message,
    "MessageAction": MessageAction,
    "MessageImagemapAction": MessageImagemapAction,
    "MessageQuotaResponse": MessageQuotaResponse,
    "MulticastRequest": MulticastRequest,
    "NarrowcastProgressResponse": NarrowcastProgressResponse,
    "NarrowcastRequest": NarrowcastRequest,
    "NumberOfMessagesResponse": NumberOfMessagesResponse,
    "OperatorDemographicFilter": OperatorDemographicFilter,
    "OperatorRecipient": OperatorRecipient,
    "PnpMessagesRequest": PnpMessagesRequest,
    "PostbackAction": PostbackAction,
    "PushMessageRequest": PushMessageRequest,
    "PushMessageResponse": PushMessageResponse,
    "QuickReply": QuickReply,
    "QuickReplyItem": QuickReplyItem,
    "QuotaConsumptionResponse": QuotaConsumptionResponse,
    "Recipient": Recipient,
    "RedeliveryRecipient": RedeliveryRecipient,
    "ReplyMessageRequest": ReplyMessageRequest,
    "ReplyMessageResponse": ReplyMessageResponse,
    "RichMenuAliasListResponse": RichMenuAliasListResponse,
    "RichMenuAliasResponse": RichMenuAliasResponse,
    "RichMenuArea": RichMenuArea,
    "RichMenuBatchLinkOperation": RichMenuBatchLinkOperation,
    "RichMenuBatchOperation": RichMenuBatchOperation,
    "RichMenuBatchProgressResponse": RichMenuBatchProgressResponse,
    "RichMenuBatchRequest": RichMenuBatchRequest,
    "RichMenuBatchUnlinkAllOperation": RichMenuBatchUnlinkAllOperation,
    "RichMenuBatchUnlinkOperation": RichMenuBatchUnlinkOperation,
    "RichMenuBounds": RichMenuBounds,
    "RichMenuBulkLinkRequest": RichMenuBulkLinkRequest,
    "RichMenuBulkUnlinkRequest": RichMenuBulkUnlinkRequest,
    "RichMenuIdResponse": RichMenuIdResponse,
    "RichMenuListResponse": RichMenuListResponse,
    "RichMenuRequest": RichMenuRequest,
    "RichMenuResponse": RichMenuResponse,
    "RichMenuSize": RichMenuSize,
    "RichMenuSwitchAction": RichMenuSwitchAction,
    "RoomMemberCountResponse": RoomMemberCountResponse,
    "RoomUserProfileResponse": RoomUserProfileResponse,
    "Sender": Sender,
    "SentMessage": SentMessage,
    "SetWebhookEndpointRequest": SetWebhookEndpointRequest,
    "StickerMessage": StickerMessage,
    "SubscriptionPeriodDemographicFilter": SubscriptionPeriodDemographicFilter,
    "Template": Template,
    "TemplateMessage": TemplateMessage,
    "TestWebhookEndpointRequest": TestWebhookEndpointRequest,
    "TestWebhookEndpointResponse": TestWebhookEndpointResponse,
    "TextMessage": TextMessage,
    "URIAction": URIAction,
    "URIImagemapAction": URIImagemapAction,
    "UpdateRichMenuAliasRequest": UpdateRichMenuAliasRequest,
    "UserProfileResponse": UserProfileResponse,
    "ValidateMessageRequest": ValidateMessageRequest,
    "VideoMessage": VideoMessage,
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
