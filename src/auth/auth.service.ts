import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignupInput } from './dto/signup.dto';
import { CoreOutput } from 'src/dtos/output.dto';
import { SigninInput, SigninOutput } from './dto/signin.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(input: SignupInput, clientId: string): Promise<CoreOutput> {
    const { email, phone } = input;
    try {
      const user = await this.usersService.findByEmailOrPhone({
        email,
        phone,
      });

      if (user && user.isVerified)
        throw new ConflictException('user already exists');

      if (user && !user.isVerified) {
        // await this.sendVerificationCode({ email, phone }, clientId);
        return { success: true };
      }

      await this.usersService.createUser({ ...input });
      // await this.sendVerificationCode({ email, phone }, clientId);

      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async signin(
    loginInput: SigninInput,
    clientId: string,
  ): Promise<SigninOutput> {
    const { email, password, phone } = loginInput;
    try {
      const options = {
        _id: 1,
        password: 1,
        isVerified: 1,
        phone: 1,
        email: 1,
      };
      const user = await this.usersService.findByEmailOrPhone({
        email,
        phone,
        options,
      });
      const isValid = password && (await user?.validatePassword?.(password));

      if (!isValid || !user) throw new UnauthorizedException('invalid user');

      const isVerified = user.isVerified;
      const payload: JwtPayload = {
        _id: user._id.toString(),
        phone: user.phone,
        email: user.email,
      };
      const token = isVerified
        ? await this.jwtService.sign(payload)
        : undefined;

      // user && this.updateClientIdsWithUser(user, clientId);
      return { success: true, token };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = undefined; //await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  verifyJwtToken(token: any) {
    return this.jwtService.verify(token);
  }
}
