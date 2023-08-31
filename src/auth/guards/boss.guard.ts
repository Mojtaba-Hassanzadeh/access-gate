import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

type GuardDecorator = ClassDecorator | MethodDecorator;

export function BossGuard<T extends GuardDecorator = ClassDecorator>(
  ...inputRoles: Role[]
): T {
  console.log('------');
  const roles = inputRoles?.length ? inputRoles : [Role.ADMIN, Role.CEO];
  console.log('roles :>> ', roles);
  return applyDecorators(
    Roles(...roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  ) as unknown as T;
}
