import { registerAs } from "@nestjs/config";
import * as Joi from "joi";
import { IsAppConfig } from "../interface";
import { ConfigurationName } from "../common";

export default registerAs(ConfigurationName.SWAGGER, () => {
  const schema = Joi.object<IsAppConfig, true>({
    swaggerId: Joi.string().required(),
    swaggerPw: Joi.string().required(),
  });

  const config = {
    swaggerId: process.env.SWAGGER_ID,
    swaggerPw: process.env.SWAGGER_PW,
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
