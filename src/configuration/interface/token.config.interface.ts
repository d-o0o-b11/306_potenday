export interface IsTokenConfig {
  jwtAccessSecret: string;
  jwtAccessExpirationTime: string;
  jwtRefreshSecret: string;
  jwtRefreshExpirationTime: string;
}
