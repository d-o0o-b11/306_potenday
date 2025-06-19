import { InternalServerErrorException } from "@nestjs/common";
import { NEST_ENV, NestEnvType } from "./types/nest-env.type";

export class NestEnvUtil {
  static getEnvFilePath = () => {
    const nodeEnv: NestEnvType = NestEnvUtil.getNodeEnv();

    return `envs/${nodeEnv}.env`;
  };

  static getNodeEnv = (): NestEnvType => {
    const nodeEnv: string | undefined = process.env.NODE_ENV;

    if (NestEnvUtil.isNestEnv(nodeEnv)) {
      return nodeEnv;
    } else {
      throw new InternalServerErrorException(`NODE_ENV(${nodeEnv})`);
    }
  };

  static isNestEnv = (envString?: string): envString is NestEnvType => {
    if (
      envString &&
      Object.values(NEST_ENV).includes(envString as NestEnvType)
    ) {
      return true;
    }
    return false;
  };
}
