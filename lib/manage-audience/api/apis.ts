export * from './manageAudienceClient';
import { ManageAudienceClient } from './manageAudienceClient';
export * from './manageAudienceBlobClient';
import { ManageAudienceBlobClient } from './manageAudienceBlobClient';
import * as http from 'http';

export { RequestFile } from '../model/models';

export const APIS = [ManageAudienceClient, ManageAudienceBlobClient];
