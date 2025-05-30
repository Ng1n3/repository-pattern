import { User } from '../entity/User';
import { IUserRepository } from '../repos/user.repository';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs'

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
    service = new UserService(mockRepo);
  });

  describe('create()', () => {
    it('should reject duplicate emails', async () => {
      // Arrange
      mockRepo.findByEmail.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.create(validUserData)).rejects.toThrow(
        'User with this email already exists'
      );

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
      mockRepo.create.mockImplementation(async (user) => ({
        ...mockUser,
        ...user
      }));

      // Act
      await service.create(validUserData);

      // Assert
      const savedUser = mockRepo.create.mock.calls[0][0];
      expect(savedUser.password).not.toBe(validUserData.password);
      expect(savedUser.password).toMatch(/^\$2[ayb]\$.{56}$/);
    });
  });

  describe('validateUser()', () => {
    it('should return null for invalid credentials', async () => {
      // Arrange
      mockRepo.findByEmail.mockResolvedValue(null);

      // Act
      const result = await service.validateUser('test@example.com', 'wrongpass');

      // Assert
      expect(result).toBeNull();
    });

    it('should return user for valid credentials', async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash('correctpass', 10);
      mockRepo.findByEmail.mockResolvedValue({
        ...mockUser,
        password: hashedPassword
      });

      // Act
      const result = await service.validateUser('test@example.com', 'correctpass');

      // Assert
      expect(result).toEqual(expect.objectContaining({
        email: 'test@example.com'
      }));
    });
  });
});