import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JsonWebTokenService } from '../auth/jwt.service';
import { Sql } from '@prisma/client/runtime/library';

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
    private sql: Sql,
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
        //generate new schema name..
        const schemaName = `schema_${firstName}`;
        console.log(schemaName);

        // const query = this.sql`CREATE SCHEMA ${this.sql.raw(schemaName)};`;
        // console.log(query);

        // await prisma.$executeRaw(query);

        console.log(`Schema ${schemaName} created successfully.`);

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
      }

      const tenantPayload: TenantPayload = {
        tenantId: tenant.tenantId,
        tenantEmail: tenant.email,
        schemaName: tenant.schemaName,
      };
      //generate jwt token here

      const token = this.jwtService.generateToken(tenantPayload);

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
