import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UserDetailsModule } from './user-details/user-details.module';
import { MenuItemModule } from './menu-item/menu-item.module';
import { MenuCategoryModule } from './menu-category/menu-category.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { InventoryModule } from './inventory/inventory.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [PrismaModule, UserDetailsModule, MenuItemModule, MenuCategoryModule, OrdersModule, OrderItemsModule, InventoryModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
