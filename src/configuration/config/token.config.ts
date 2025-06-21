import { registerAs } from "@nestjs/config";
import * as Joi from "joi";
import { IsTokenConfig } from "../interface";

export default registerAs("token", () => {
  const schema = Joi.object<IsTokenConfig, true>({
    jwtAccessSecret: Joi.string().required(),
    jwtAccessExpirationTime: Joi.string().required(),
    jwtRefreshSecret: Joi.string().required(),
    jwtRefreshExpirationTime: Joi.string().required(),
  });

  const config = {
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtAccessExpirationTime: process.env.JWT_ACCESS_EXPIRATION_TIME,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtRefreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME,
  };

  const { error, value } = schema.validate(config, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  return value;
});
