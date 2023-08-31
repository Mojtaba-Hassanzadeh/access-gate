import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    console.log('user :>> ', user);
    if (err || !user) {
      throw err || new UnauthorizedException('شما به سیستم وارد نشده اید');
    }
    return user;
  }
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
