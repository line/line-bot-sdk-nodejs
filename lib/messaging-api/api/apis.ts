export * from './messagingApiApi';
import { MessagingApiApi } from './messagingApiApi';
export * from './messagingApiBlobApi';
import { MessagingApiBlobApi } from './messagingApiBlobApi';
import * as http from 'http';

export class HttpError extends Error {
    constructor (public response: http.IncomingMessage, public body: any, public statusCode?: number) {
        super('HTTP request failed');
        this.name = 'HttpError';
    }
}

export { RequestFile } from '../model/models';

export const APIS = [MessagingApiApi, MessagingApiBlobApi];
