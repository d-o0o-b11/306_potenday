export const SwaggerAuth = {
  /** AT header */
  AUTH_AT: "AUTH_AT",
} as const;

export type SwaggerAuthType = (typeof SwaggerAuth)[keyof typeof SwaggerAuth];
