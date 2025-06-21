export const NEST_ENV = {
  /* 배포 환경 */
  PRODUCTION: "production",
  /* 개발 환경 */
  DEV: "development",
  /* 테스트 환경 */
  TEST: "test",
} as const;

export type NestEnvType = (typeof NEST_ENV)[keyof typeof NEST_ENV];
