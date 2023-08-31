import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtMiddleWare implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    console.log('********', req);
    if ('authorization' in req.headers) {
      const bearerHeader = req.headers.authorization;
      const token = bearerHeader?.replace('Bearer ', '');
      try {
        const decoded: JwtPayload = this.authService.verifyJwtToken(token);
        if (typeof decoded === 'object' && decoded['_id']) {
          const { _id } = decoded;
          const user = await this.usersService.findById(_id);
          req['user'] = user || undefined;
        }
      } catch (error) {
        console.log(error);
      }
    }
    next();
  }
}
