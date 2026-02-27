import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload } from '../interface/jwt-payload.interface';

export const CurrentUser = createParamDecorator(
  <K extends keyof JwtPayload>(
    data: K | undefined,
    ctx: ExecutionContext,
  ): JwtPayload[K] | JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user) {
      throw new UnauthorizedException();
    }

    return data ? user[data] : user;
  },
);
