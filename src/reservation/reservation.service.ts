import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomException } from 'src/common/customException';
import { TableStatus } from 'src/tables/dto/create-table.dto';

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

    const tableAvailable = await this.prisma.tables.findFirst({
      where: {
        AND: {
          capacity: {
            gte: createReservationDto.members,
          },
          status: {
            in: [TableStatus.AVAILABLE],
          },
        },
      },
      orderBy: {
        capacity: 'asc',
      },
    });

    if (!tableAvailable) throw new CustomException('Table Not available', 404);

    return await this.prisma.reservation.create({
      data: {
        userId: createReservationDto.userId,
        reservationStatus: 'Pending',
        tableId: tableAvailable.tableId,
        members: createReservationDto.members,
      },
    });
  }

  async findAll() {
    return await this.prisma.reservation.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.reservation.findFirst({
      where: {
        reservationId: id,
      },
      include: {
        payment: true,
      },
    });
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    return await this.prisma.reservation.update({
      where: { reservationId: id },
      data: { ...updateReservationDto },
    });
  }

  async remove(id: number) {
    return await this.prisma.reservation.delete({
      where: { reservationId: id },
    });
  }
}
