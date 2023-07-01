import { registerAs } from "@nestjs/config";
import * as Joi from "joi";
import { IsMaileConfig } from "./mail.interface";

export default registerAs("mail", () => {
  const schema = Joi.object<IsMaileConfig, true>({
    user: Joi.string().required(),
    pass: Joi.string().required(),
  });

  const config = {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD,
  };

  console.log("config2", config);

  const { error } = schema.validate(config, {
    abortEarly: false,
  });

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  return config;
});
