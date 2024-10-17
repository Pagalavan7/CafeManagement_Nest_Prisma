import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDetailDto } from './dto/create-user-detail.dto';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomException } from 'src/common/exceptions/customException';

@Injectable()
export class UserDetailsService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDetailDto: CreateUserDetailDto) {
    try {
      const user = await this.prisma.user_Details.create({
        data: {
          ...createUserDetailDto,
        },
      });
      return user;
    } catch (error) {
      console.error('error is ', error); // Logging the full error to understand its structure

      if (error.code === 'P2002') {
        //P2002 is prisma's unique constraint error.
        throw new ConflictException('Email already exists');
      }

      throw new InternalServerErrorException('Something went wrong');
      // throw new CustomException(error.message);
    }
  }

  async findAll() {
    try {
      const user = await this.prisma.user_Details.findMany();
      if (!user.length) throw new NotFoundException('No users found.');
      return user;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err; // Re-throw to propagate it further
      }
      console.log('error is :', err);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user_Details.findFirst({
        where: {
          userId: id,
        },
      });

      if (!user) throw new NotFoundException('No user found with id ' + id);
      return user;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      console.log(err);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async update(id: number, updateUserDetailDto: UpdateUserDetailDto) {
    try {
      return await this.prisma.user_Details.update({
        data: {
          ...updateUserDetailDto,
        },
        where: {
          userId: id,
        },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new CustomException(`No user with id ${id} is found.`, 400);
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async remove(id: number) {
    try {
      const user = await this.prisma.user_Details.delete({
        where: {
          userId: id,
        },
      });
      return user;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new CustomException(`No user with id ${id} is found.`, 400);
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
