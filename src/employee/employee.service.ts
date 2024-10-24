import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDetailsService } from 'src/user-details/user-details.service';

@Injectable()
export class EmployeeService {
  constructor(
    private prisma: PrismaService,
    private userService: UserDetailsService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const { employeeRoleId, ...createUserDTO } = createEmployeeDto;

    const isUserPresent = await this.userService.findUserByEmail(
      createUserDTO.email,
    );
    if (!isUserPresent) {
      const { userId } = await this.userService.create(createUserDTO);
      return await this.prisma.employee.create({
        data: {
          employeeRoleId: employeeRoleId,
          userId: userId,
        },
        include: {
          user: true,
        },
      });
    }

    return await this.prisma.employee.create({
      data: {
        employeeRoleId: employeeRoleId,
        userId: isUserPresent.userId,
      },
      include: {
        user: true,
      },
    });
  }

  async findAll() {
    const employees = await this.prisma.employee.findMany({
      include: {
        role: true,
        user: true,
      },
    });

    const modified = employees.map((x) => ({
      employeeId: x.employeeId,
      userName: x.user.firstName,
      employeeRoleId: x.employeeRoleId,
      role: x.role.role,
    }));

    return modified;
  }

  async findOne(id: number) {
    const employee = await this.prisma.employee.findFirst({
      where: { employeeId: id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        role: {
          select: {
            role: true,
          },
        },
      },
    });

    const modified = {
      employeeId: employee.employeeId,
      firstName: employee.user.firstName,
      lastName: employee.user.lastName,
      email: employee.user.email,
      employeeRoleId: employee.employeeRoleId,
      employeeRole: employee.role.role,
    };
    return modified;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return await this.prisma.employee.update({
      data: { ...updateEmployeeDto },
      where: { employeeId: id },
    });
  }

  async remove(id: number) {
    return await this.prisma.employee.delete({
      where: { employeeId: id },
    });
  }
}
