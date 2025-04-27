import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './src/entity/User';
dotenv.config();

export default defineConfig({
  out: './src/migrations',
  schema: './src/entity/User.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URI!,
  },
  verbose: true,
  strict: true,
});

const pool = new Pool({
  connectionString: process.env.DB_URI!,
  max: 25,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const AppDataSource = drizzle(pool, { schema });
