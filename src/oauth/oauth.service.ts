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
        console.log('new user creation');

        //generate new schema name..
        const schemaName = `schema_${firstName}`;
        console.log(schemaName);

        await this.prisma.$executeRawUnsafe(
          `EXEC ('CREATE SCHEMA [${schemaName}]');`,
        );

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
      //generate jwt token here

      console.log(tenantPayload);

      const token = await this.jwtService.generateToken(tenantPayload);
      console.log(token);

      // Send user data or JWT (if using) back to the client
      return {
        message: 'New schema created.',
        jwtToken: token,
      };
    } catch (error) {
      console.error('Error creating schema:', error);
      throw new Error('Failed to create schema');
    }
  }
}
