import { connectMongoDB } from '../data-source';
import { CreateUserDto, IUser, UpdateUserDto, User } from '../entity/User';
import { testConnectMongoDB } from '../test-data-source';

export interface IUserRepository {
  create(userData: CreateUserDto): Promise<IUser>;
  update(id: string, userData: UpdateUserDto): Promise<IUser | null>;
  findAll(): Promise<IUser[]>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  delete(id: string): Promise<void>;
}

export class UserRepository implements IUserRepository {
  constructor() {
    const dataSource =
      process.env.NODE_ENV === 'test' ? testConnectMongoDB : connectMongoDB;
  }

  async create(userData: CreateUserDto): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }

  async update(id: string, userData: UpdateUserDto): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, userData, {new: true});
  }

  async findAll(): Promise<IUser[]> {
    return User.find();
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById( id );
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  async delete(id: string): Promise<void> {
    await User.findByIdAndDelete(id);
  }
}
