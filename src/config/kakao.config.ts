import { registerAs } from "@nestjs/config";
import * as Joi from "joi";
import { DatabaseType } from "typeorm";
import { IsKakaoConfig } from "./kakao.config.interface";

export default registerAs("kakao", () => {
  const schema = Joi.object<IsKakaoConfig, true>({
    rest_api: Joi.string().required(),
    client_secret: Joi.string().required(),
    redirect_url: Joi.string().required(),
  });

  const config = {
    rest_api: process.env.REST_API,
    client_secret: process.env.CLIENT_SECRET,
    redirect_url: process.env.REDIRECT_URI,
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
