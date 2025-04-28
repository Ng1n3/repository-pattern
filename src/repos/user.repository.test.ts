import { User } from '../entity/User';
import { TestDataSource } from '../test-data-source';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let repository: UserRepository;

  beforeAll(async () => {
    await TestDataSource.initialize();
    repository = new UserRepository();
  });

  afterAll(async () => {
    await TestDataSource.destroy();
  });

  beforeEach(async () => {
    // Clear data between tests
    await TestDataSource.getRepository(User).clear();
  });

  it('should create and find users', async () => {
    // Arrange
    const user = new User();
    user.name = 'Test';
    user.email = 'test@test.com';
    user.password = 'hashed_password';

    // Act
    const createdUser = await repository.create(user);
    const found = await repository.findById(createdUser.id);

    // Assert
    expect(found).toBeDefined();
    expect(found?.email).toBe(user.email);
    expect(found?.name).toBe(user.name);
    expect(found?.password).toBe(user.password);
    expect(found?.id).toBeDefined();
    expect(found?.createdAt).toBeInstanceOf(Date);
    expect(found?.updatedAt).toBeInstanceOf(Date);
  });

  it('should find user by email', async () => {
    // Arrange
    const user = new User();
    user.name = 'Email Test';
    user.email = 'email_test@test.com';
    user.password = 'hashed_password';
    await repository.create(user);

    // Act
    const found = await repository.findByEmail(user.email);

    // Assert
    expect(found?.email).toBe(user.email);
  });

  it('should update user', async () => {
    // Arrange
    const user = new User();
    user.name = 'Update Test';
    user.email = 'update_test@test.com';
    user.password = 'hashed_password';
    const createdUser = await repository.create(user);

    // Act
    const updatedUser = await repository.update(createdUser.id, {
      name: 'Updated Name'
    });

    // Assert
    expect(updatedUser?.name).toBe('Updated Name');
    expect(updatedUser?.email).toBe(user.email); // Email should remain unchanged
  });

  it('should delete user', async () => {
    // Arrange
    const user = new User();
    user.name = 'Delete Test';
    user.email = 'delete_test@test.com';
    user.password = 'hashed_password';
    const createdUser = await repository.create(user);

    // Act
    await repository.delete(createdUser.id);
    const found = await repository.findById(createdUser.id);

    // Assert
    expect(found).toBeNull();
  });
});
