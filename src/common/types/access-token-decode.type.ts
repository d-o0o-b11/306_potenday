export interface AccessTokenDecodePayload {
  userId: string;
  sessionId: string;
  exp?: number;
  iat?: number;
}
