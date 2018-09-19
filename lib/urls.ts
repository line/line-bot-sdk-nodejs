import * as qs from "querystring";

const baseURL: string =
  process.env.API_BASE_URL || "https://api.line.me/v2/bot/";

const apiURL = (path: string, query?: object) =>
  baseURL + path + (query ? `?${qs.stringify(query)}` : "");

export const reply: string = apiURL("message/reply");

export const push: string = apiURL("message/push");

export const multicast: string = apiURL("message/multicast");

export const content = (messageId: string) =>
  apiURL(`message/${messageId}/content`);

export const profile = (userId: string) => apiURL(`profile/${userId}`);

export const groupMemberProfile = (groupId: string, userId: string) =>
  apiURL(`group/${groupId}/member/${userId}`);

export const roomMemberProfile = (roomId: string, userId: string) =>
  apiURL(`room/${roomId}/member/${userId}`);

export const groupMemberIds = (groupId: string, start?: string) =>
  apiURL(`group/${groupId}/members/ids`, start ? { start } : null);

export const roomMemberIds = (roomId: string, start?: string) =>
  apiURL(`room/${roomId}/members/ids`, start ? { start } : null);

export const leaveGroup = (groupId: string) => apiURL(`group/${groupId}/leave`);

export const leaveRoom = (roomId: string) => apiURL(`room/${roomId}/leave`);

export const richMenu = (richMenuId?: string) =>
  apiURL("richmenu" + (richMenuId ? `/${richMenuId}` : ""));

export const richMenuList = () => apiURL(`richmenu/list`);

export const userRichMenu = (userId: string, richMenuId?: string) =>
  apiURL(`user/${userId}/richmenu` + (richMenuId ? `/${richMenuId}` : ""));

export const richMenuContent = (richMenuId: string) =>
  apiURL(`richmenu/${richMenuId}/content`);

export const defaultRichMenu = (richMenuId?: string) =>
  apiURL("user/all/richmenu" + (richMenuId ? `/${richMenuId}` : ""));
