import * as bcrypt from 'bcryptjs';
import { CreateUserDto, UpdateUserDto, User } from '../entity/User';
import { IUserRepository } from '../repos/user.repository';

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async create(userData: CreateUserDto): Promise<User> {

    if (!this.validateEmail(userData.email)) {
      throw new Error("Invalid email format")
    }

    if(userData.password.length < 8) {
      throw new Error("Password must be at least 8 characters long")
    }

    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return this.userRepository.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    });
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

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }
    return user;
  }

  private validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
