import { registerAs } from "@nestjs/config";
import * as Joi from "joi";
import { IsMaileConfig } from "../interface";
import { ConfigurationName } from "../common";

export default registerAs(ConfigurationName.MAIL, () => {
  const schema = Joi.object<IsMaileConfig, true>({
    user: Joi.string().required(),
    pass: Joi.string().required(),
  });

  const config = {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD,
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
