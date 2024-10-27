import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomException } from 'src/common/customException';

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
        `User with ID ${createReservationDto.userId} not found. Sign up and continue`,
      );

    const timings = await this.calculateTime(
      createReservationDto.bookingStartTime,
      createReservationDto.totalHrs,
    );

    const tableAvailable = await this.prisma.tables.findFirst({
      where: {
        AND: [
          {
            capacity: {
              gte: createReservationDto.members,
            },
          },
          // {
          //   status: {
          //     equals: TableStatus.AVAILABLE,
          //   },
          // },
          {
            reservation: {
              every: {
                OR: [
                  {
                    bookingStartTime: {
                      gte: timings.endTime,
                    },
                  },
                  {
                    bookingEndTime: {
                      lte: timings.startTime,
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      orderBy: {
        capacity: 'asc',
      },
    });

    if (!tableAvailable)
      throw new CustomException(
        'Table Not available. Please use different slot!',
        404,
      );

    const totalPrice = await this.calculateTablePrice(
      tableAvailable.tableId,
      createReservationDto.members,
      createReservationDto.totalHrs,
    );

    return await this.prisma.reservation.create({
      data: {
        userId: createReservationDto.userId,
        reservationStatus: 'Pending',
        tableId: tableAvailable.tableId,
        members: createReservationDto.members,
        totalHrs: createReservationDto.totalHrs,
        totalPrice: totalPrice,
        bookingStartTime: timings.startTime,
        bookingEndTime: timings.endTime,
      },
    });
  }

  async calculateTime(startTime: string, totalHrs: number) {
    let time = new Date(startTime);

    const endTime = new Date(time.getTime() + totalHrs * 60 * 60 * 1000);

    return { startTime, endTime };
  }

  async calculateTablePrice(
    tableId: number,
    members: number,
    totalHrs: number,
  ) {
    const priceDetails = await this.prisma.tablePrice.findFirst({
      where: { tableId: tableId },
    });

    let { pricePerHour, hoursDiscount } = priceDetails;

    let basePrice = members * pricePerHour;
    if (totalHrs > 1) {
      let discountPrice = ((basePrice * hoursDiscount) / 100) * (totalHrs - 1);
      basePrice = basePrice - discountPrice;
    }
    return basePrice;
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
