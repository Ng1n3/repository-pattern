import { DataSource } from 'typeorm';
import { User } from './entity/User';

export const TestDataSource = new DataSource({
  type: 'mysql',
  host: process.env.TEST_DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'your_database',
  synchronize: true,
  dropSchema: true, // Clean DB between test suites
  entities: [User],
  logging: false,
});
