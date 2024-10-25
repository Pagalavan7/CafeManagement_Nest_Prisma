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
      //payment for order
      if (createPaymentDto.orderId) {
        const order = await this.prisma.order.findFirst({
          where: { orderId: createPaymentDto.orderId },
        });

        if (!order)
          throw new NotFoundException(
            `No order with id ${createPaymentDto.orderId} is found`,
          );

        //checking whether payment already made and succeeded..
        const payment = await this.prisma.payment.findMany({
          where: {
            orderId: createPaymentDto.orderId,
          },
        });
        console.log('payments made for order', payment);

        const result = payment.filter((x) => x.paymentStatusId === 2);

        if (!result.length) {
          createPaymentDto = {
            ...createPaymentDto,
            paymentAmount: order.totalOrderAmount,
          };
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
            amountToBePaid: paymentStatus.paymentAmount,
            amountPaid: paymentStatus.paymentAmount,
            paymentStatusId: paymentStatus.paymentStatusId,
            paymentStatus: paymentStatus.paymentStatus.statusName,
          };
          console.log(modifiedPaymentStatus);
          return modifiedPaymentStatus;
        } else
          throw new CustomException(
            `Payment already made for order ${createPaymentDto.orderId}`,
            409,
          );
      }

      //payment for reservation
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
          (x) => x.paymentStatusId === 2,
        );

        if (!result.length) {
          createPaymentDto = {
            ...createPaymentDto,
            paymentAmount: reservation.totalPrice,
          };

          const payment = await this.prisma.payment.create({
            data: { ...createPaymentDto },
            include: {
              paymentStatus: true,
            },
          });

          if (payment.paymentStatus.statusName == 'SUCCESS') {
            //if payment success .. update the reservation, table and payment amount..
            await this.updatePaymentAmount(
              payment.paymentId,
              reservation.totalPrice,
            );
            await this.updateReservationStatus(
              reservation.reservationId,
              reservation.tableId,
            );
          }

          const modifiedPaymentStatus = {
            paymentId: payment.paymentId,
            reservationId: payment.reservationId,
            amountToBePaid: payment.paymentAmount,
            amountPaid: payment.paymentAmount,
            paymentStatusId: payment.paymentStatusId,
            paymentStatus: payment.paymentStatus.statusName,
          };

          return modifiedPaymentStatus;
        } else
          throw new CustomException(
            `Payment already made for reservation ${createPaymentDto.reservationId}`,
            409,
          );
      }
    } catch (err) {
      console.log(err);
      if (err instanceof NotFoundException) {
        console.log(err);
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

  async updatePaymentAmount(id: number, paymentAmount: number) {
    return await this.prisma.payment.update({
      where: {
        paymentId: id,
      },
      data: { paymentAmount: paymentAmount },
    });
  }

  async updateReservationStatus(reservationId, tableId) {
    await this.prisma.reservation.update({
      where: {
        reservationId: reservationId,
      },
      data: { reservationStatus: ReservationStatus.BOOKED },
    });

    await this.prisma.tables.update({
      where: {
        tableId: tableId,
      },
      data: {
        status: TableStatus.RESERVED,
      },
    });
  }
}
