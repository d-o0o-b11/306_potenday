import { registerAs } from "@nestjs/config";
import * as Joi from "joi";
import { DatabaseType } from "typeorm";
import { IsRedisConfig } from "../interface";
import { ConfigurationName } from "../common";

export default registerAs(ConfigurationName.REDIS, () => {
  const schema = Joi.object<IsRedisConfig, true>({
    host: Joi.string().required(),
    port: Joi.number().required(),
    password: Joi.string().required(),
  });

  const config = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  };

  const { error, value } = schema.validate(config, {
    abortEarly: false,
    // true :  첫번째 오류에서 유효성 검사 중지
    // false : 모든 오류 반환
  });

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  return value;
});
