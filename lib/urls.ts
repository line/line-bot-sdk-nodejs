const baseURL: string = process.env.API_BASE_URL || "https://api.line.me/v2/bot/";

const apiURL = (path: string) => baseURL + path;

export const reply: string = apiURL("message/reply");
export const push: string = apiURL("message/push");
export const multicast: string = apiURL("message/multicast");
export const content = (messageId: string) => apiURL(`message/${messageId}/content`);
export const profile = (userId: string) => apiURL(`profile/${userId}`);
export const groupMemberProfile = (groupId: string, userId: string) => apiURL(`group/${groupId}/member/${userId}`);
export const roomMemberProfile = (roomId: string, userId: string) => apiURL(`room/${roomId}/member/${userId}`);
export const groupMemberIds = (groupId: string, continuationToken: string) => {
    return apiURL(`group/${groupId}/members/ids?start=${continuationToken}`);
};
export const roomMemberIds = (roomId: string, continuationToken: string) => {
    return apiURL(`room/${roomId}/members/ids?start=${continuationToken}`);
};
export const leaveGroup = (groupId: string) => apiURL(`group/${groupId}/leave`);
export const leaveRoom = (roomId: string) => apiURL(`room/${roomId}/leave`);
