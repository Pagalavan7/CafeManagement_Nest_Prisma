import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { table } from 'console';
import { CustomException } from 'src/common/exceptions/customException';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}
  async create(createReservationDto: CreateReservationDto) {
    const user = await this.prisma.user_Details.findFirst({
      where: {
        userId: createReservationDto.userId,
      },
    });
    if (!user)
      throw new NotFoundException(
        `User with ID ${createReservationDto.userId} not found`,
      );

    const tableAvailable = await this.prisma.tables.findMany({
      where: {
        capacity: {
          gte: createReservationDto.members,
        },
      },
      orderBy: {
        capacity: 'asc',
      },
    });

    if (!tableAvailable.length)
      throw new CustomException('Table Not available', 404);

    return await this.prisma.reservation.create({
      data: { ...createReservationDto, ReservationStatus: 'Pending' },
    });
  }

  async findAll() {
    return await `This action returns all reservation`;
  }

  async findOne(id: number) {
    return await `This action returns a #${id} reservation`;
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    return await `This action updates a #${id} reservation`;
  }

  async remove(id: number) {
    return await `This action removes a #${id} reservation`;
  }
}
