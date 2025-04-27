import { User } from '../entity/User';
import { IUserRepository } from '../repos/user.repository';
import { UserService } from './user.service';

const validUserData = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'securePassword123!',
};

const mockUser: User = {
  id: '123',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashed_password',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRepo: jest.Mocked<IUserRepository> = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UserService(mockRepo as any);
  });

  describe('create()', () => {
    it('should reject duplicate emails', async () => {
      // Arrange
      mockRepo.findByEmail.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.create(validUserData)).rejects.toThrow(
        'User with this email already exists'
      );

      // Verify mock was called
      expect(mockRepo.findByEmail).toHaveBeenCalledWith(validUserData.email);
    });

    it('should create new users with valid data', async () => {
      // Arrange
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue(mockUser);

      // Act
      const result = await service.create(validUserData);

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockRepo.create).toHaveBeenCalledWith({
        name: validUserData.name,
        email: validUserData.email,
        password: expect.stringMatching(/^\$2[ayb]\$.{56}$/) // Hashed password
      });
    });

    it('should hash passwords before saving', async () => {
      // Arrange
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue(mockUser);

      // Act
      await service.create(validUserData);

      // Assert
      const savedUser = mockRepo.create.mock.calls[0][0];
      expect(savedUser.password).not.toBe(validUserData.password);
      expect(savedUser.password).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt pattern
    });
  });
});
