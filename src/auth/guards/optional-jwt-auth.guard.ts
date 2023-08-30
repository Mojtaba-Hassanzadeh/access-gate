import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    return user;
  }
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
