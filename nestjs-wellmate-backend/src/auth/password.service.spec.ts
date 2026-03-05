import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  afterEach(() => {
    jest.clearAllMocks(); //ลบMockหลังรันจบเเต่ละ Test Case
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hash', () => {
    it('should call bcrypt.hash with password and rounds', async () => {
      const password = 'mySecretPassword';
      const expectedHash = 'hashedString123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(expectedHash);
      const result = await service.hash(password);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(expectedHash);
    });
  });

  describe('compare', () => {
    it('sould return true if password matches hash', async () => {
      const password = 'mySecretPassword';
      const hash = 'hashedString123';
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const result = await service.compare(password, hash);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(true);
    });
    it('sould return false if password does not match hash', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      const result = await service.compare('wrongPassword', 'hash');
      expect(result).toBe(false);
    });
  });
});
