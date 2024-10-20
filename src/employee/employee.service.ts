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
    //check email already present..
    //if present, update role as employee and add a employee..
    //if not present create a new user and add a employee..
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
    return await `This action returns all employee`;
  }

  async findOne(id: number) {
    return await `This action returns a #${id} employee`;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return await `This action updates a #${id} employee`;
  }

  async remove(id: number) {
    return await `This action removes a #${id} employee`;
  }
}
