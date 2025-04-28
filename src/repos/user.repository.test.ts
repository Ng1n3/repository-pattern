import { User } from '../entity/User';
import { UserRepository } from './user.repository';
import mongoose from 'mongoose';

describe('UserRepository', () => {
  let repository: UserRepository;
  
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect('mongodb://localhost:27017/userz-test');
    repository = new UserRepository();
  });

  afterAll(async () => {
    // Disconnect after tests
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear data between tests
    await User.deleteMany({});
  });

  it('should create and find users', async () => {
    // Arrange
    const userData = {
      name: 'Test',
      email: 'test@test.com',
      password: 'hashed_password'
    };

    // Act
    const createdUser = await repository.create(userData);
    const found = await repository.findById(createdUser._id.toString());

    // Assert
    expect(found).toBeDefined();
    expect(found?.email).toBe(userData.email);
    expect(found?.name).toBe(userData.name);
    expect(found?.password).toBe(userData.password);
    expect(found?._id).toBeDefined();
    expect(found?.createdAt).toBeInstanceOf(Date);
    expect(found?.updatedAt).toBeInstanceOf(Date);
  });

  it('should find user by email', async () => {
    // Arrange
    const userData = {
      name: 'Email Test',
      email: 'email_test@test.com',
      password: 'hashed_password'
    };
    
    await repository.create(userData);

    // Act
    const found = await repository.findByEmail(userData.email);

    // Assert
    expect(found?.email).toBe(userData.email);
  });

  it('should update user', async () => {
    // Arrange
    const userData = {
      name: 'Update Test',
      email: 'update_test@test.com',
      password: 'hashed_password'
    };
    
    const createdUser = await repository.create(userData);

    // Act
    const updatedUser = await repository.update(createdUser._id.toString(), {
      name: 'Updated Name'
    });

    // Assert
    expect(updatedUser?.name).toBe('Updated Name');
    expect(updatedUser?.email).toBe(userData.email); // Email should remain unchanged
  });

  it('should delete user', async () => {
    // Arrange
    const userData = {
      name: 'Delete Test',
      email: 'delete_test@test.com',
      password: 'hashed_password'
    };
    
    const createdUser = await repository.create(userData);

    // Act
    await repository.delete(createdUser._id.toString());
    const found = await repository.findById(createdUser._id.toString());

    // Assert
    expect(found).toBeNull();
  });
});