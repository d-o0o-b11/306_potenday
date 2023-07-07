import { registerAs } from "@nestjs/config";
import * as Joi from "joi";
import { IsKakaoConfig } from "./kakao.config.interface";

export default registerAs("kakao", () => {
  const schema = Joi.object<IsKakaoConfig, true>({
    rest_api: Joi.string().required(),
    client_secret: Joi.string().required(),
    redirect_url: Joi.string().required(),
    redirect_front_url: Joi.string().required(),
  });

  const config = {
    rest_api: process.env.REST_API,
    client_secret: process.env.CLIENT_SECRET,
    redirect_url: process.env.REDIRECT_URI,
    redirect_front_url: process.env.REDIRECT_FRONT_URI,
  };

  console.log("cofig", config);

  const { error, value } = schema.validate(config, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  return value;
});
