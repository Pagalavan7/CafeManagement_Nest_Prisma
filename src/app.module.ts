import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { TablesModule } from './tables/tables.module';
import { ReservationModule } from './reservation/reservation.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { RolesModule } from './roles/roles.module';
import { EmployeeModule } from './employee/employee.module';
import { TablePriceModule } from './table-price/table-price.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { OauthModule } from './oauth/oauth.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './oauth/google.strategy';

@Module({
  imports: [
    PrismaModule,
    UserDetailsModule,
    MenuItemModule,
    MenuCategoryModule,
    OrdersModule,
    OrderItemsModule,
    InventoryModule,
    PaymentModule,
    TablesModule,
    ReservationModule,
    AuthModule,
    RolesModule,
    EmployeeModule,
    TablePriceModule,
    OauthModule,
    PassportModule.register({ defaultStrategy: 'google' }),
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    GoogleStrategy,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        // '/auth/signup',
        // '/auth/login',
        '/auth/google',
        '/auth/google/callback',
      )
      .forRoutes('*');
  }
}
