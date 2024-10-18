import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { CustomException } from 'src/common/exceptions/customException';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      const paymentsMadeForOrder = await this.prisma.payment.findMany({
        where: {
          orderId: createPaymentDto.orderId,
        },
      });
      console.log('payments made for order', paymentsMadeForOrder);

      const result = paymentsMadeForOrder.filter(
        (x) => x.paymentStatusId === 2,
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
        console.log(modifiedPaymentStatus);
        return modifiedPaymentStatus;
      }

      throw new CustomException(
        `Payment already made for order ${createPaymentDto.orderId}`,
      );
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
}
