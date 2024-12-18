import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDetailDto } from './dto/create-user-detail.dto';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomException } from 'src/common/customException';

@Injectable()
export class UserDetailsService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDetailDto: CreateUserDetailDto) {
    try {
      const user = await this.prisma.user_Details.create({
        data: {
          ...createUserDetailDto,
        },
        include: {
          role: {
            select: { role: true },
          },
        },
      });
      return user;
    } catch (error) {
      console.log(error || error.message);
      if (error.code === 'P2002') {
        //P2002 is prisma's unique constraint error.
        throw new ConflictException('Email already exists');
      }

      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }

  async findAll() {
    try {
      const user = await this.prisma.user_Details.findMany();
      if (!user.length) throw new NotFoundException('No users found.');
      return user;
    } catch (err) {
      console.log(err);
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findUserByEmail(email: string) {
    try {
      return this.prisma.user_Details.findFirst({
        where: {
          email: email,
        },
        include: {
          role: {
            select: { role: true },
          },
        },
      });
    } catch (err) {
      console.log(err.message || err);
      throw err;
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

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async update(
    id: number,
    updateUserDetailDto: UpdateUserDetailDto,
    user: any,
  ) {
    try {
      const userDetails = await this.findOne(id);

      //validating the user logged in is updating his details..
      //he should not update other's details

      if (userDetails.userId === user.userId) {
        return await this.prisma.user_Details.update({
          data: {
            ...updateUserDetailDto,
          },
          where: {
            userId: id,
          },
        });
      } else
        throw new CustomException('You cannot update other user credentials');
    } catch (err) {
      if (err.code === 'P2025') {
        throw new CustomException(`No user with id ${id} is found.`, 400);
      } else if (err instanceof CustomException) throw err;
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
