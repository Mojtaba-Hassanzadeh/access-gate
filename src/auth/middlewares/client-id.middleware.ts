import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { validate as isValidUUID } from 'uuid';

@Injectable()
export class ClientIdMiddleWare implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if ('client-id' in req.headers) {
      const clientId = req.headers['client-id'] as string;
      isValidUUID(clientId) && (req['clientId'] = clientId);
    }
    next();
  }
}
