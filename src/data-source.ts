import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'your_database',
  synchronize: true, // Set to false in production
  logging: false,
  entities: [User],
  subscribers: [],
  migrations: [__dirname + '/migrations/*.ts'],
});
