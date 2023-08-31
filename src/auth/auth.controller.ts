import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignupInput } from './dto/signup.dto';
import { ClientId } from './decorators/client-id.decorator';
import { CoreOutput } from 'src/dtos/output.dto';
import { SigninInput, SigninOutput } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() input: SignupInput,
    @ClientId() clientId: string,
  ): Promise<CoreOutput> {
    return this.authService.signup(input, clientId);
  }

  @Get('signin')
  async signin(
    @Request() req: SigninInput,
    @ClientId() clientId: string,
  ): Promise<SigninOutput> {
    return this.authService.signin(req, clientId);
  }

  // forget-password
  // reset-password
}
