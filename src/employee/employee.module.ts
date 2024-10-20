import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserDetailsModule } from 'src/user-details/user-details.module';

@Module({
  imports: [PrismaModule, UserDetailsModule],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
