import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { CustomException } from 'src/common/customException';
import { ReservationStatus } from 'src/reservation/dto/create-reservation.dto';
import { TableStatus } from 'src/tables/dto/create-table.dto';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      if (createPaymentDto.orderId) {
        //payment for order
        const order = await this.prisma.order.findFirst({
          where: { orderId: createPaymentDto.orderId },
        });
        if (!order)
          throw new NotFoundException(
            `No order with id ${createPaymentDto.orderId} is found`,
          );

        const paymentsMadeForOrder = await this.prisma.payment.findMany({
          where: {
            orderId: createPaymentDto.orderId,
          },
        });

        const result = paymentsMadeForOrder.filter(
          (x) => x.paymentStatusId === 1,
        );

        if (!result.length) {
          const paymentStatus = await this.prisma.payment.create({
            data: { ...createPaymentDto },
            include: {
              paymentStatus: {
                select: {
                  statusName: true,
                },
              },
            },
          });
          const modifiedPaymentStatus = {
            paymentId: paymentStatus.paymentId,
            orderId: paymentStatus.orderId,
            paymentStatusId: paymentStatus.paymentStatusId,
            paymentStatus: paymentStatus.paymentStatus.statusName,
          };

          return modifiedPaymentStatus;
        } else
          throw new CustomException(
            `Payment already made for order ${createPaymentDto.orderId}`,
            409,
          );
      }
      if (createPaymentDto.reservationId) {
        const reservation = await this.prisma.reservation.findFirst({
          where: { reservationId: createPaymentDto.reservationId },
        });

        if (!reservation)
          throw new NotFoundException(
            `No reservation with id ${createPaymentDto.reservationId} is found`,
          );

        const paymentsMadeForReservation = await this.prisma.payment.findMany({
          where: {
            reservationId: createPaymentDto.reservationId,
          },
        });

        const result = paymentsMadeForReservation.filter(
          (x) => x.paymentStatusId === 1,
        );

        if (!result.length) {
          const paymentStatus = await this.prisma.payment.create({
            data: { ...createPaymentDto },
            include: {
              paymentStatus: true,
            },
          });

          const modifiedPaymentStatus = {
            paymentId: paymentStatus.paymentId,
            reservationId: paymentStatus.reservationId,
            paymentStatusId: paymentStatus.paymentStatusId,
            paymentStatus: paymentStatus.paymentStatus.statusName,
          };

          if (modifiedPaymentStatus.paymentStatus == 'COMPLETED') {
            await this.updateReservationStatus(
              reservation.reservationId,
              reservation.tableId,
            );
          }

          return modifiedPaymentStatus;
        } else
          throw new CustomException(
            `Payment already made for reservation ${createPaymentDto.reservationId}`,
            409,
          );
      }
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }

      if (err instanceof CustomException)
        throw new ConflictException(err.message);
      throw new InternalServerErrorException('something went wrong');
    }
  }

  async findAll() {
    return await this.prisma.payment.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.payment.findUnique({
      where: {
        paymentId: id,
      },
    });
  }

  async updateReservationStatus(reservationId, tableId) {
    await this.prisma.reservation.update({
      where: {
        reservationId: reservationId,
      },
      data: { reservationStatus: ReservationStatus.BOOKED },
    });
  }
}
