import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDetailDto } from 'src/user-details/dto/create-user-detail.dto';
import { UserDetailsService } from 'src/user-details/user-details.service';
import { JsonWebTokenService } from './jwt.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { BcryptService } from './hash.service';

export interface TokenPayload {
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userRole: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserDetailsService,
    private JWTService: JsonWebTokenService,
    private bcryptService: BcryptService,
  ) {}

  async createUser(createUserDTO: CreateUserDetailDto, request: any) {
    try {
      const result = await this.userService.findUserByEmail(
        createUserDTO.email,
      );
      if (result) {
        throw new ConflictException('User already present. Please log in.');
      }

      const hashedPassword = await this.bcryptService.hashPassword(
        createUserDTO.password,
      );

      createUserDTO = { ...createUserDTO, password: hashedPassword };

      const user = await this.userService.create(createUserDTO);

      const payload = await this.generatePayload(user, request);

      console.log('payload for signup token ', payload);

      const token = await this.JWTService.generateToken(payload);
      const { role, password, ...userData } = user; //no need of returning password to user..
      return {
        message: 'User creation successful.',
        userToken: token,
        user: userData,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async loginUser(loginUserDTO: LoginUserDTO, request: any) {
    try {
      console.log('inside login user service..');

      const user = await this.userService.findUserByEmail(loginUserDTO.email);
      console.log(user, ' is the user');
      if (!user) {
        throw new NotFoundException(
          'User not found. Please sign up to continue.',
        );
      }

      const isPasswordValid = await this.bcryptService.comparePassword(
        loginUserDTO.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException(
          'Invalid credentials. Please check your password.',
        );
      }
      const payload = await this.generatePayload(user, request);

      const token = await this.JWTService.generateToken(payload);
      return { message: 'User login successful.', userToken: token };
    } catch (err) {
      console.log(err || err.message);
      if (err instanceof NotFoundException) throw err;
    }
  }

  async generatePayload(user, request) {
    const payload = {
      userId: user.userId,
      userFirstName: user.firstName,
      userLastName: user.lastName,
      userEmail: user.email,
      userRole: user.role.role,
      tenantId: request.tenantId,
      schemaName: request.schemaName,
    };
    return payload;
  }
}
