import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      return await this.prisma.roles.create({
        data: { ...createRoleDto },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async findAll() {
    return await this.prisma.roles.findMany();
  }

  async findRolewithUsers(id: number) {
    return await this.prisma.roles.findFirst({
      where: { roleId: id },
      include: { user: true },
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return await this.prisma.roles.update({
      data: { ...updateRoleDto },
      where: { roleId: id },
    });
  }

  async remove(id: number) {
    return await this.prisma.roles.delete({
      where: { roleId: id },
    });
  }
}
