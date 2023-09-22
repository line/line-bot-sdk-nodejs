export * from './manageAudienceApi';
import { ManageAudienceApi } from './manageAudienceApi';
export * from './manageAudienceBlobApi';
import { ManageAudienceBlobApi } from './manageAudienceBlobApi';
import * as http from 'http';

export { RequestFile } from '../model/models';

export const APIS = [ManageAudienceApi, ManageAudienceBlobApi];
