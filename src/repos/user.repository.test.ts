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
    const user = new User();

    user.name = 'Test';
    user.email = 'test@test.com';
    user.password = 'hashed_password';
    user.comparePassword = async () => true;

    const createdUser = await repository.create(user);
    const found = await repository.findById(createdUser.id);
    expect(found?.email).toBe(user.email);
  });
});
