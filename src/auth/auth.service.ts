import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
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
    const result = await this.userService.findUserByEmail(createUserDTO.email);
    if (result) {
      throw new ConflictException('User already present. Please log in.');
    }

    const hashedPassword = await this.bcryptService.hashPassword(
      createUserDTO.password,
    );

    createUserDTO = { ...createUserDTO, password: hashedPassword };

    const user = await this.userService.create(createUserDTO);

    const payload = {
      userFirstName: user.firstName,
      userLastName: user.lastName,
      userEmail: user.email,
      userRole: user.role.role,
      tenantId: request.tenantId,
      schemaName: request.schemaName,
    };

    console.log('payload for signup token ', payload);

    const token = await this.JWTService.generateToken(payload);
    const { role, password, ...userData } = user; //no need of returning password to user..
    return { message: 'User created.', user: userData, token: token };
  }

  async loginUser(loginUserDTO: LoginUserDTO, request: any) {
    const user = await this.userService.findUserByEmail(loginUserDTO.email);

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

    const payload = {
      userFirstName: user.firstName,
      userLastName: user.lastName,
      userEmail: user.email,
      userRole: user.role.role,
      tenantId: request.tenantId,
      schemaName: request.schemaName,
    };

    const token = await this.JWTService.generateToken(payload);
    return { message: 'User login successful.', token: token };
  }
}
