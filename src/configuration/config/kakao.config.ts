import { registerAs } from "@nestjs/config";
import * as Joi from "joi";
import { IsKakaoConfig } from "../interface";
import { ConfigurationName } from "../common";

export default registerAs(ConfigurationName.KAKAO, () => {
  const schema = Joi.object<IsKakaoConfig, true>({
    restAPI: Joi.string().required(),
    clientSecret: Joi.string().required(),
    redirectUrl: Joi.string().required(),
    redirectFrontUrl: Joi.string().required(),
  });

  const config = {
    restAPI: process.env.REST_API,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUrl: process.env.REDIRECT_URI,
    redirectFrontUrl: process.env.REDIRECT_FRONT_URI,
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
