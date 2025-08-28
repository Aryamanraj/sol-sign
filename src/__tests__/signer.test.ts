import { SolanaMessageSigner } from '../lib/signer';
import { Keypair } from '@solana/web3.js';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('SolanaMessageSigner', () => {
  let signer: SolanaMessageSigner;
  let testKeypair: Keypair;
  let testKeypairPath: string;

  beforeAll(() => {
    signer = new SolanaMessageSigner();
    testKeypair = Keypair.generate();
    
    // Create a temporary keypair file for testing
    testKeypairPath = join(tmpdir(), 'test-keypair.json');
    writeFileSync(testKeypairPath, JSON.stringify(Array.from(testKeypair.secretKey)));
  });

  afterAll(() => {
    // Clean up test files
    try {
      unlinkSync(testKeypairPath);
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('signWithKeypairFile', () => {
    it('should sign a message using a keypair file', async () => {
      const message = 'Hello, Solana!';
      const result = await signer.signWithKeypairFile(message, testKeypairPath);

      expect(result).toHaveProperty('signature');
      expect(result).toHaveProperty('publicKey');
      expect(result.publicKey).toBe(testKeypair.publicKey.toBase58());
      expect(typeof result.signature).toBe('string');
    });

    it('should support different output formats', async () => {
      const message = 'Test message';
      
      const base58Result = await signer.signWithKeypairFile(message, testKeypairPath, 'base58');
      const hexResult = await signer.signWithKeypairFile(message, testKeypairPath, 'hex');
      const base64Result = await signer.signWithKeypairFile(message, testKeypairPath, 'base64');

      expect(base58Result.signature).toMatch(/^[1-9A-HJ-NP-Za-km-z]+$/);
      expect(hexResult.signature).toMatch(/^[0-9a-f]+$/);
      expect(base64Result.signature).toMatch(/^[A-Za-z0-9+/]+=*$/);
    });

    it('should throw error for invalid keypair file', async () => {
      const message = 'Test message';
      const invalidPath = '/nonexistent/file.json';

      await expect(
        signer.signWithKeypairFile(message, invalidPath)
      ).rejects.toThrow();
    });
  });

  describe('signWithPrivateKey', () => {
    it('should sign a message using a private key array', async () => {
      const message = 'Hello, Solana!';
      const privateKeyArray = JSON.stringify(Array.from(testKeypair.secretKey));
      
      const result = await signer.signWithPrivateKey(message, privateKeyArray);

      expect(result).toHaveProperty('signature');
      expect(result).toHaveProperty('publicKey');
      expect(result.publicKey).toBe(testKeypair.publicKey.toBase58());
    });

    it('should throw error for invalid private key', async () => {
      const message = 'Test message';
      const invalidKey = 'invalid-key';

      await expect(
        signer.signWithPrivateKey(message, invalidKey)
      ).rejects.toThrow();
    });
  });

  describe('verifySignature', () => {
    it('should verify a valid signature', async () => {
      const message = 'Test message for verification';
      const signResult = await signer.signWithKeypairFile(message, testKeypairPath);
      
      const isValid = await signer.verifySignature(
        message,
        signResult.signature,
        signResult.publicKey
      );

      expect(isValid).toBe(true);
    });

    it('should reject an invalid signature', async () => {
      const message = 'Test message';
      const wrongMessage = 'Wrong message';
      const signResult = await signer.signWithKeypairFile(message, testKeypairPath);
      
      const isValid = await signer.verifySignature(
        wrongMessage,
        signResult.signature,
        signResult.publicKey
      );

      expect(isValid).toBe(false);
    });

    it('should verify signatures in different formats', async () => {
      const message = 'Format test message';
      
      const base58Result = await signer.signWithKeypairFile(message, testKeypairPath, 'base58');
      const hexResult = await signer.signWithKeypairFile(message, testKeypairPath, 'hex');
      const base64Result = await signer.signWithKeypairFile(message, testKeypairPath, 'base64');

      const base58Valid = await signer.verifySignature(
        message, base58Result.signature, base58Result.publicKey, 'base58'
      );
      const hexValid = await signer.verifySignature(
        message, hexResult.signature, hexResult.publicKey, 'hex'
      );
      const base64Valid = await signer.verifySignature(
        message, base64Result.signature, base64Result.publicKey, 'base64'
      );

      expect(base58Valid).toBe(true);
      expect(hexValid).toBe(true);
      expect(base64Valid).toBe(true);
    });
  });

  describe('generateKeypair', () => {
    it('should generate a new keypair', () => {
      const keypair = signer.generateKeypair();
      
      expect(keypair).toBeDefined();
      expect(keypair.publicKey).toBeDefined();
      expect(keypair.secretKey).toBeDefined();
      expect(keypair.secretKey.length).toBe(64);
    });

    it('should generate unique keypairs', () => {
      const keypair1 = signer.generateKeypair();
      const keypair2 = signer.generateKeypair();
      
      expect(keypair1.publicKey.toBase58()).not.toBe(keypair2.publicKey.toBase58());
    });
  });
});
