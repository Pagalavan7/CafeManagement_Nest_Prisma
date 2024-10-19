import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDetailDto } from 'src/user-details/dto/create-user-detail.dto';
import { UserDetailsService } from 'src/user-details/user-details.service';
import { JWTService } from './jwt.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { BcryptService } from './hash.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserDetailsService,
    private JWTService: JWTService,
    private bcryptService: BcryptService,
  ) {}

  async createUser(createUserDTO: CreateUserDetailDto) {
    const result = await this.userService.findUserByEmail(createUserDTO.email);
    if (result)
      throw new ConflictException('User already present. Please log in.');

    const hashedPassword = await this.bcryptService.hashPassword(
      createUserDTO.password,
    );

    createUserDTO = { ...createUserDTO, password: hashedPassword };

    const user = await this.userService.create(createUserDTO);

    const payload = { userEmail: user.email, userRole: user.role };
    const token = await this.JWTService.generateToken(payload);
    return { token: token };
  }

  async loginUser(loginUserDTO: LoginUserDTO) {
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

    const payload = { userEmail: user.email, userRole: user.role };
    const token = await this.JWTService.generateToken(payload);
    return { token: token };
  }
}
