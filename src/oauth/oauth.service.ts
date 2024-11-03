import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JsonWebTokenService } from '../auth/jwt.service';
import { PrismaClient } from '@prisma/client';

export interface TenantPayload {
  tenantId: string;
  tenantEmail: string;
  schemaName: string;
}

@Injectable()
export class OauthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JsonWebTokenService,
  ) {}

  async getTenantByGoogleId(
    googleId: string,
    email: string,
    firstName: string,
    lastName: string,
    profilePicture: string,
  ) {
    try {
      let tenant = await this.prisma.tenant_User.findFirst({
        where: {
          googleId: googleId,
        },
      });

      if (!tenant) {
        console.log('new tenant and schema creation');

        //generate new schema name..
        const schemaName = `schema_${firstName}`;
        console.log(schemaName);

        this.prisma.createSchema(schemaName);

        tenant = await this.prisma.tenant_User.create({
          data: {
            googleId,
            email,
            schemaName,
            firstName,
            lastName,
            profilePicture,
          },
        });
      } else {
        console.log('user already found, data in tenant table is', tenant);
      }

      const tenantPayload: TenantPayload = {
        tenantId: tenant.tenantId,
        tenantEmail: tenant.email,
        schemaName: tenant.schemaName,
      };

      console.log(tenantPayload);

      const token = await this.jwtService.generateToken(tenantPayload);
      console.log(token);

      return {
        jwtToken: token,
      };
    } catch (error) {
      throw new Error('Failed to create schema');
    }
  }
}
