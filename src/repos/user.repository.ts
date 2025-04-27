import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { AppDataSource } from '../../drizzle.config';
import { NewUser, UpdateUserDto, User, users } from '../entity/User';
import { TestDataSource } from '../test-data-source';

export interface IUserRepository {
  create(userData: NewUser): Promise<User>;
  update(id: string, userData: UpdateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  delete(id: string): Promise<void>;
}

export class UserRepository implements IUserRepository {
  private ormRepository: ReturnType<typeof drizzle>;

  constructor() {
    this.ormRepository =
      process.env.NODE_ENV === 'test' ? TestDataSource : AppDataSource;
  }

  async create(user: NewUser): Promise<User> {
    const [createduser] = await this.ormRepository
      .insert(users)
      .values(user)
      .returning();
    return createduser;
  }

  async update(id: string, userData: UpdateUserDto): Promise<User> {
    const [updatedUser] = await this.ormRepository
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();

    return updatedUser;
  }

  async findAll(): Promise<User[]> {
    return this.ormRepository.select().from(users);
  }

  async findById(id: string): Promise<User | null> {
    const [user] = await this.ormRepository
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await this.ormRepository
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user || null;
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(users).where(eq(users.id, id));
  }
}
