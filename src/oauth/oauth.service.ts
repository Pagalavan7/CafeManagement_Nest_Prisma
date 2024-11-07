import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JsonWebTokenService } from '../auth/jwt.service';
import { PrismaClient } from '@prisma/client';
import { CustomException } from 'src/common/customException';

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
    let message;
    try {
      let tenant = await this.prisma.tenant_User.findFirst({
        where: {
          googleId: googleId,
        },
      });

      //if tenant is present.. need to check whether schema exist in database..
      //if shcema not there.. create schema with same name of schema in tenant table
      //if schema is present na.. then send token..

      if (!tenant) {
        console.log('new tenant and schema creation');
        //generate new schema name..
        const schemaName = `schema_${email}`;

        const sanitizedSchema = schemaName.replace(/[^a-zA-Z0-9_]/g, '');
        await this.prisma.createSchema(sanitizedSchema);
        tenant = await this.prisma.tenant_User.create({
          data: {
            googleId,
            email,
            schemaName: sanitizedSchema,
            firstName,
            lastName,
            profilePicture,
          },
        });
        message = `Welcome!! A separate schema has been created successfully and assigned to ${tenant.email}. To utilize Cafe Backend Application, please copy the OAuth token below and follow the steps mentioned in the documentation`;
      } else if (!(await this.prisma.schemaExists(tenant.schemaName))) {
        console.log('coming inside schema creation');
        console.log('email already exist.. but schema not exist in database');
        console.log('so create new schema');
        await this.prisma.createSchema(tenant.schemaName);
        message = `Welcome Back!! Schema created and assigned to ${tenant.email} Use the below OAuth token and signup or login to Cafe Management Application to continue`;
      } else {
        message = `Welcome Back! Use the below OAuth token and signup or login to Cafe Management Application to continue`;

        console.log(
          'schema also present in db.. user also persent in tenant table',
          tenant.schemaName,
        );
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
        message: message,
        OAuthJWTToken: token,
      };
    } catch (error) {
      console.log('Oauth schema creation.. and token generation failed..');
      throw new InternalServerErrorException(error.message || error);
    }
  }
}
