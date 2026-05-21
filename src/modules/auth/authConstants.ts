const now = new Date();
const day = 24 * 60 * 60 * 100;

export const REFRESH_TOKEN_EXPIRES_IN: number = Date.now() + 7 * day;
export const EXPIRED_ACCESS_TOKEN_JWT = "10m";
export const EXPIRED_RESET_TOKEN_JWT = "15m";
export const EXPIRED_REFRESH_TOKEN_JWT = "7d";
