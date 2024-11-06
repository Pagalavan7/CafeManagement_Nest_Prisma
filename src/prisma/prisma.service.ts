import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { async } from 'rxjs';
import { CustomRequest } from 'src/auth/auth.middleware';
// import { CustomRequest } from 'src/auth/auth.middleware';

interface TableColumn {
  table_name: string;
  column_name: string;
  data_type: string;
  is_nullable: string;
  character_maximum_length: number | null;
  column_default: string | null;
}

interface TableConstraint {
  table_name: string;
  constraint_name: string;
  constraint_type: string;
  column_name: string;
  foreign_table_name: string | null;
  foreign_column_name: string | null;
}
@Injectable({ scope: Scope.REQUEST })
export class PrismaService extends PrismaClient {
  constructor(@Inject(REQUEST) private request: CustomRequest) {
    console.log('prisma service constructor called.');
    const schemaName = request.user?.schemaName;
    let databaseUrl = process.env.DATABASE_URL; // Base database URL from env

    if (schemaName) {
      databaseUrl = `${databaseUrl}?schema=${schemaName}`;
    }

    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });

    console.log(`Connected to schema: ${schemaName}`);
  }

  async createSchema(targetSchema: string) {
    try {
      const sanitizedSchema = targetSchema.replace(/[^a-zA-Z0-9_]/g, '');

      await this.$transaction(
        async () => {
          // Step 1: Create the new schema
          await this.$executeRawUnsafe(
            `CREATE SCHEMA IF NOT EXISTS "${sanitizedSchema}";`,
          );

          // Step 2: Retrieve tables from the public schema, excluding tenant_user
          const tables = await this.$queryRaw<TableColumn[]>`
            SELECT table_name, column_name, data_type, is_nullable, character_maximum_length, column_default
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name != 'Tenant_User';`;

          // Step 3: Organize column data for each table
          const tableDefinitions = {};
          tables.forEach((col) => {
            if (!tableDefinitions[col.table_name]) {
              tableDefinitions[col.table_name] = {
                columns: [],
                primaryKeys: [],
                foreignKeys: [],
                uniqueConstraints: [],
              };
            }

            // Enclose column names and constraints in double quotes for case sensitivity
            const columnDef = `"${col.column_name}" ${col.data_type}${
              col.character_maximum_length
                ? `(${col.character_maximum_length})`
                : ''
            } ${col.is_nullable === 'NO' ? 'NOT NULL' : ''} ${
              col.column_default ? `DEFAULT ${col.column_default}` : ''
            }`;
            tableDefinitions[col.table_name].columns.push(columnDef);
          });

          // Step 4: Create each table in the new schema
          for (const tableName of Object.keys(tableDefinitions)) {
            const columnsSQL = tableDefinitions[tableName].columns.join(', ');
            const createTableSQL = `CREATE TABLE "${sanitizedSchema}"."${tableName}" (${columnsSQL});`;
            await this.$executeRawUnsafe(createTableSQL);
          }

          // Step 5: Retrieve primary key constraints from the public schema
          const primaryKeys = await this.$queryRaw<TableConstraint[]>`
            SELECT tc.table_name, kcu.column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
            WHERE tc.table_schema = 'public' AND tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_name != 'Tenant_User';`;

          // Step 6: Attach primary key constraints to each table
          primaryKeys.forEach((pk) => {
            if (tableDefinitions[pk.table_name]) {
              tableDefinitions[pk.table_name].primaryKeys.push(
                `"${pk.column_name}"`,
              );
            }
          });

          // Apply primary key constraints after table creation
          for (const tableName of Object.keys(tableDefinitions)) {
            const primaryKeys = tableDefinitions[tableName].primaryKeys;
            if (primaryKeys.length > 0) {
              const primaryKeySQL = `ALTER TABLE "${sanitizedSchema}"."${tableName}" ADD CONSTRAINT "${tableName}_pkey" PRIMARY KEY (${primaryKeys.join(', ')});`;
              await this.$executeRawUnsafe(primaryKeySQL);
            }
          }

          // Step 7: Retrieve foreign key constraints from the public schema
          const foreignKeys = await this.$queryRaw<TableConstraint[]>`
            SELECT
              tc.table_name,
              kcu.column_name,
              ccu.table_name AS foreign_table_name,
              ccu.column_name AS foreign_column_name
            FROM
              information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
            WHERE
              tc.table_schema = 'public' AND tc.constraint_type = 'FOREIGN KEY'
              AND tc.table_name != 'Tenant_User';`;

          // Step 8: Apply foreign key constraints
          for (const fk of foreignKeys) {
            const foreignKeySQL = `ALTER TABLE "${sanitizedSchema}"."${fk.table_name}" ADD CONSTRAINT "${fk.table_name}_${fk.column_name}_fkey" FOREIGN KEY ("${fk.column_name}") REFERENCES "${sanitizedSchema}"."${fk.foreign_table_name}"("${fk.foreign_column_name}");`;
            await this.$executeRawUnsafe(foreignKeySQL);
          }

          // Step 9: Retrieve unique constraints from the public schema
          const uniqueConstraints = await this.$queryRaw<TableConstraint[]>`
            SELECT tc.table_name, kcu.column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
            WHERE tc.table_schema = 'public' AND tc.constraint_type = 'UNIQUE'
            AND tc.table_name != 'Tenant_User';`;

          // Step 10: Apply unique constraints
          uniqueConstraints.forEach(async (uc) => {
            const uniqueSQL = `ALTER TABLE "${sanitizedSchema}"."${uc.table_name}" ADD CONSTRAINT "${uc.table_name}_${uc.column_name}_unique" UNIQUE ("${uc.column_name}");`;
            await this.$executeRawUnsafe(uniqueSQL);
          });

          await this.defaultValuesInsertion(targetSchema);
        },
        { timeout: 15000 },
      );
      console.log('Schema creation complete.');
    } catch (err) {
      console.error('Error creating schema:', err);
      throw err;
    }
  }

  async defaultValuesInsertion(targetSchema: string) {
    try {
      const insertRolesQuery = `
      INSERT INTO "${targetSchema}"."Roles" ("roleId", "role")
      VALUES (1, 'Admin'), (2, 'Customer'), (3, 'Employee'), (4, 'Manager')
    `;

      const insertPaymentStatusQuery = `
      INSERT INTO "${targetSchema}"."Payment_Status" ("statusId", "statusName")
      VALUES (1, 'SUCCESS'), (2, 'PENDING'), (3, 'FAILED')
    `;
      // Construct the SQL query string using template literals for schema names

      // Use transaction for consistency
      await this.$transaction(async (tx) => {
        await tx.$executeRawUnsafe(insertRolesQuery);
        await tx.$executeRawUnsafe(insertPaymentStatusQuery);
      });
      console.log('Default values inserted successfully');
    } catch (error) {
      console.error('Error inserting default values:', error);
      throw new Error('Default values insertion failed');
    }
  }
}
