import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignupInput } from './dto/signup.dto';
import { CoreOutput } from 'src/dtos/output.dto';
import {
  IsValidAndVerifiedAccountInput,
  IsValidAndVerifiedAccountOutput,
  SigninInput,
  SigninOutput,
} from './dto/signin.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { VerifyAccountInput } from './dto/verify-account.dto';
import { TVerification, Verification } from './entities/verification.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TUser } from 'src/users/entities/user.entity';
import { ForgetPasswordInput } from './dto/forget-password.dto';
import { ChangePasswordInput } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(Verification.name)
    private readonly verificationModel: Model<TVerification>,
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

  async verifyAccount(
    verifyEmailInput: VerifyAccountInput,
    clientId: string,
  ): Promise<CoreOutput> {
    try {
      const { code } = verifyEmailInput;

      const verification = await this.verificationModel
        .findOne({
          clientId,
        })
        .populate('user');

      if (!verification) throw new NotFoundException('invalid token');

      const isValid = await verification.validateCode(code);
      if (!isValid) throw new NotFoundException('invalid token');

      const user = verification.user as unknown as TUser;
      user.isVerified = true;
      await user.save();
      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async isValidAndVerifiedAccount(
    input: IsValidAndVerifiedAccountInput,
  ): Promise<IsValidAndVerifiedAccountOutput> {
    try {
      const { email, phone } = input;
      const options = {
        _id: 1,
        isVerified: 1,
        password: 1,
      };
      const user = await this.usersService.findByEmailOrPhone({
        email,
        phone,
        options,
      });

      if (!user) throw new NotFoundException('user not found');

      return {
        success: true,
        isVerified: user.isVerified,
        hasPassword: !!user.password,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async forgetPassword(
    { email, phone }: ForgetPasswordInput,
    clientId: string,
  ): Promise<CoreOutput> {
    try {
      const user = await this.usersService.findByEmailOrPhone({
        email,
        phone,
      });

      if (!user) throw new NotFoundException('user not found');

      // await this.sendVerificationCode({ email, phone }, clientId);
      return {
        success: true,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async changePassword(
    { code, password }: ChangePasswordInput,
    clientId: string,
  ): Promise<CoreOutput> {
    try {
      const verification = await this.verificationModel
        .findOne({
          clientId,
        })
        .populate('user');

      if (!verification) throw new NotFoundException('invalid token');

      const isValid = await verification?.validateCode(code);
      if (!isValid) throw new NotFoundException('invalid token');

      const user = verification.user as unknown as TUser;
      user.password = password;
      await user.save();
      await this.verificationModel.findByIdAndDelete(verification.id);
      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  verifyJwtToken(token: any) {
    return this.jwtService.verify(token);
  }
}
