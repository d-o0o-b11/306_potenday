import { IsNumber } from "class-validator";

export class JWTToken {
  @IsNumber()
  id: number;
}
