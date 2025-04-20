import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { CreateUserDto, UpdateUserDto, User } from '../entity/User';

export interface IUserRepository {
  create(userData: CreateUserDto): Promise<User>;
  update(id: string, userData: UpdateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  delete(id: string): Promise<void>;
}

export class UserRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(User);
  }

  async create(userData: CreateUserDto): Promise<User> {
    const user = this.ormRepository.create(userData);
    return this.ormRepository.save(user);
  }

  async update(id: string, userData: UpdateUserDto): Promise<User> {
    await this.ormRepository.update(id, userData);
    const updatedUser = await this.findById(id);
    if (!updatedUser) throw new Error('User not found after update');
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
