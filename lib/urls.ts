const baseURL: string = process.env.API_BASE_URL || "https://api.line.me/v2/bot/";

const apiURL = (path: string) => baseURL + path;

export const reply: string = apiURL("message/reply");
export const push: string = apiURL("message/push");
export const multicast: string = apiURL("message/multicast");
export const content = (messageId: string) => apiURL(`message/${messageId}/content`);
export const profile = (userId: string) => apiURL(`profile/${userId}`);
export const leaveGroup = (groupId: string) => apiURL(`group/${groupId}/leave`);
export const leaveRoom = (roomId: string) => apiURL(`room/${roomId}/leave`);
