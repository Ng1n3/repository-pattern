import { CreateUserDto, UpdateUserDto, User } from '../entity/User';
import { IUserRepository } from '../repos/user.repository';

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async create(userData: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    return this.userRepository.create(userData);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async update(id: string, userData: UpdateUserDto): Promise<User> {
    return this.userRepository.update(id, userData);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
