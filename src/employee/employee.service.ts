import { ConflictException, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDetailsService } from 'src/user-details/user-details.service';
import { CustomException } from 'src/common/customException';

@Injectable()
export class EmployeeService {
  constructor(
    private prisma: PrismaService,
    private userService: UserDetailsService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      let { employeeRoleId, ...createUserDTO } = createEmployeeDto;

      const isUserPresent = await this.userService.findUserByEmail(
        createUserDTO.email,
      );
      if (!isUserPresent) {
        createUserDTO = { ...createUserDTO, roleId: 3 };
        const { userId } = await this.userService.create(createUserDTO); //sending default role id..
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
    } catch (err) {
      console.log(err);
      throw new CustomException('Error while creating employee');
    }
  }

  async findAll() {
    try {
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
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async findOne(id: number) {
    try {
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
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      return await this.prisma.employee.update({
        data: { ...updateEmployeeDto },
        where: { employeeId: id },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.employee.delete({
        where: { employeeId: id },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
