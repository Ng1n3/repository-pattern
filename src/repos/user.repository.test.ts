import { NewUser, users } from '../entity/User';
import { TestDataSource } from '../test-data-source';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let repository: UserRepository;

  beforeAll(async () => {
    repository = new UserRepository();
  });

  afterAll(async () => {
    await TestDataSource.delete(users);
  });

  beforeEach(async () => {
    // Clear data between tests
    await TestDataSource.delete(users);
  });

  it('should create and find users', async () => {
    const userData: NewUser = {
      name: 'Test',
      email: 'test@test.com',
      password: 'hashed_password',
    };

    const createdUser = await repository.create(userData);
    const found = await repository.findById(createdUser.id);
    
    expect(found).toBeTruthy();
    expect(found?.email).toBe(userData.email);
    expect(found?.name).toBe(userData.name);
  });
});
