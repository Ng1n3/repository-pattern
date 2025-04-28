import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { UpdateUserDto, User } from '../entity/User';
import { TestDataSource } from '../test-data-source';

export interface IUserRepository {
  create(userData: User): Promise<User>;
  update(id: string, userData: UpdateUserDto): Promise<User|null>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  delete(id: string): Promise<void>;
}

export class UserRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    const dataSource =
      process.env.NODE_ENV === 'test' ? TestDataSource : AppDataSource;
    this.ormRepository = dataSource.getRepository(User);
  }

  async create(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  async update(id: string, userData: UpdateUserDto): Promise<User | null> {
    await this.ormRepository.update(id, userData);
    const updatedUser = await this.findById(id);
    return updatedUser;
  }

  async findAll(): Promise<User[]> {
    return this.ormRepository.find();
  }

  async findById(id: string): Promise<User | null> {
    return this.ormRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.ormRepository.findOneBy({ email });
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
