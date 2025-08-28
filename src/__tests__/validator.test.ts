import { 
  validateKeypairFile, 
  validatePrivateKey, 
  validatePublicKey, 
  validateSignature 
} from '../lib/validator';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('Validator functions', () => {
  let testKeypairPath: string;
  let invalidKeypairPath: string;

  beforeAll(() => {
    // Create test files
    testKeypairPath = join(tmpdir(), 'test-valid-keypair.json');
    invalidKeypairPath = join(tmpdir(), 'test-invalid-keypair.json');

    // Valid keypair (64 bytes)
    const validKeypair = Array.from({ length: 64 }, (_, i) => i % 256);
    writeFileSync(testKeypairPath, JSON.stringify(validKeypair));

    // Invalid keypair (wrong format)
    writeFileSync(invalidKeypairPath, JSON.stringify({ invalid: 'format' }));
  });

  afterAll(() => {
    // Clean up test files
    try {
      unlinkSync(testKeypairPath);
      unlinkSync(invalidKeypairPath);
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('validateKeypairFile', () => {
    it('should validate a correct keypair file', () => {
      expect(validateKeypairFile(testKeypairPath)).toBe(true);
    });

    it('should reject an invalid keypair file', () => {
      expect(validateKeypairFile(invalidKeypairPath)).toBe(false);
    });

    it('should reject a non-existent file', () => {
      expect(validateKeypairFile('/nonexistent/file.json')).toBe(false);
    });
  });

  describe('validatePrivateKey', () => {
    it('should validate a JSON array private key', () => {
      const validArray = JSON.stringify(Array.from({ length: 64 }, (_, i) => i % 256));
      expect(validatePrivateKey(validArray)).toBe(true);
    });

    it('should validate a base58 private key', () => {
      const validBase58 = '5Kd3NBUAdUnhyzenEwVLy9pBKxSwXvE9FMPyR4UKZvpe6E6VTjLjyBXhF';
      expect(validatePrivateKey(validBase58)).toBe(true);
    });

    it('should validate a hex private key', () => {
      const validHex = 'a'.repeat(128); // 64 bytes in hex
      expect(validatePrivateKey(validHex)).toBe(true);
    });

    it('should reject an invalid private key', () => {
      expect(validatePrivateKey('invalid-key')).toBe(false);
      expect(validatePrivateKey('')).toBe(false);
      expect(validatePrivateKey('123')).toBe(false);
    });

    it('should reject invalid JSON array', () => {
      const invalidArray = JSON.stringify(Array.from({ length: 32 }, () => 0)); // Wrong length
      expect(validatePrivateKey(invalidArray)).toBe(false);
    });
  });

  describe('validatePublicKey', () => {
    it('should validate a correct Solana public key', () => {
      const validPublicKey = 'GjwXnHdp2TemWxhCbGNbWyjKwGVU73F7bwU9MYJG7Xqb'; // Valid 44 char base58
      expect(validatePublicKey(validPublicKey)).toBe(true);
    });

    it('should reject an invalid public key', () => {
      expect(validatePublicKey('invalid-public-key')).toBe(false);
      expect(validatePublicKey('')).toBe(false);
      expect(validatePublicKey('123')).toBe(false);
    });
  });

  describe('validateSignature', () => {
    it('should validate hex signatures', () => {
      const validHexSignature = 'a'.repeat(128); // 64 bytes in hex
      expect(validateSignature(validHexSignature, 'hex')).toBe(true);
      
      const invalidHexSignature = 'a'.repeat(64); // Wrong length
      expect(validateSignature(invalidHexSignature, 'hex')).toBe(false);
    });

    it('should validate base58 signatures', () => {
      const validBase58Signature = '1'.repeat(87); // Valid length for base58
      expect(validateSignature(validBase58Signature, 'base58')).toBe(true);
      
      const invalidBase58Signature = '1'.repeat(50); // Wrong length
      expect(validateSignature(invalidBase58Signature, 'base58')).toBe(false);
    });

    it('should validate base64 signatures', () => {
      const validBase64Signature = 'A'.repeat(87) + '='; // 88 chars total
      expect(validateSignature(validBase64Signature, 'base64')).toBe(true);
      
      const invalidBase64Signature = 'A'.repeat(50); // Wrong length
      expect(validateSignature(invalidBase64Signature, 'base64')).toBe(false);
    });

    it('should reject invalid signature formats', () => {
      expect(validateSignature('test', 'invalid' as any)).toBe(false);
      expect(validateSignature('', 'hex')).toBe(false);
    });
  });
});
