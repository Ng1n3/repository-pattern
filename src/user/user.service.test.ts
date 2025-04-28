import { Types } from 'mongoose';
import { IUser, UserProps } from '../entity/User';
import { IUserRepository } from '../repos/user.repository';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';

// Create a mock user with just the properties we need for testing
export function createMockUser(overrides: Partial<UserProps> = {}): IUser {
  const user: UserProps & { _id: Types.ObjectId } = {
    _id: new Types.ObjectId(),
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashed_password',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
  
  // Add necessary Document methods
  return {
    ...user,
    // Minimal implementation of necessary Document methods
    $isNew: false,
    save: jest.fn().mockImplementation(function(this: IUser) { 
      return Promise.resolve(this); 
    }),
    // Add stub implementations for other required Document methods
    $assertPopulated: jest.fn(),
    $clearModifiedPaths: jest.fn(),
    $clone: jest.fn(),
    $createModifiedPathsSnapshot: jest.fn(),
    // Add other Document methods as needed
  } as unknown as IUser;
}

const validUserData = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'securePassword123!',
};

const mockUser = createMockUser();

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
  
      // Create a proper mock implementation that returns an IUser-like object
      mockRepo.create.mockImplementation(async (userData) => 
        createMockUser(userData as UserProps)
      );
      
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
      const userWithHashedPassword = createMockUser({
        password: hashedPassword
      });
      
      mockRepo.findByEmail.mockResolvedValue(userWithHashedPassword);

      // Act
      const result = await service.validateUser('test@example.com', 'correctpass');

      // Assert
      expect(result).toEqual(expect.objectContaining({
        email: 'test@example.com'
      }));
    });
  });
});