import { SetMetadata } from '@nestjs/common';
import { REQUIRE_PERMISSION_KEY } from '../constants/constants';

export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(REQUIRE_PERMISSION_KEY, permissions);
