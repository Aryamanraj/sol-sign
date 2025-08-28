import { Keypair, PublicKey } from '@solana/web3.js';
import * as nacl from 'tweetnacl';
import { readFileSync } from 'fs';

export interface SignResult {
  signature: string;
  publicKey: string;
}

export class SolanaMessageSigner {
  /**
   * Sign a message using a keypair file
   */
  async signWithKeypairFile(
    message: string,
    keypairPath: string,
    outputFormat: 'hex' | 'base58' | 'base64' = 'base58'
  ): Promise<SignResult> {
    try {
      const keypairData = JSON.parse(readFileSync(keypairPath, 'utf8'));
      const keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
      
      return this.signMessage(message, keypair, outputFormat);
    } catch (error) {
      throw new Error(`Failed to sign with keypair file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Sign a message using a private key string
   */
  async signWithPrivateKey(
    message: string,
    privateKey: string,
    outputFormat: 'hex' | 'base58' | 'base64' = 'base58'
  ): Promise<SignResult> {
    try {
      let keypair: Keypair;

      // Try to parse as base58 string first
      try {
        const secretKey = this.decodePrivateKey(privateKey);
        keypair = Keypair.fromSecretKey(secretKey);
      } catch {
        // If base58 fails, try parsing as JSON array
        try {
          const keyArray = JSON.parse(privateKey);
          if (Array.isArray(keyArray)) {
            keypair = Keypair.fromSecretKey(new Uint8Array(keyArray));
          } else {
            throw new Error('Invalid private key format');
          }
        } catch {
          throw new Error('Private key must be a base58 string or JSON array of bytes');
        }
      }

      return this.signMessage(message, keypair, outputFormat);
    } catch (error) {
      throw new Error(`Failed to sign with private key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Sign a message with a Keypair object
   */
  private signMessage(
    message: string,
    keypair: Keypair,
    outputFormat: 'hex' | 'base58' | 'base64'
  ): SignResult {
    const messageBytes = new TextEncoder().encode(message);
    const signature = nacl.sign.detached(messageBytes, keypair.secretKey);
    
    return {
      signature: this.formatSignature(signature, outputFormat),
      publicKey: keypair.publicKey.toBase58()
    };
  }

  /**
   * Verify a signature
   */
  async verifySignature(
    message: string,
    signature: string,
    publicKey: string,
    signatureFormat: 'hex' | 'base58' | 'base64' = 'base58'
  ): Promise<boolean> {
    try {
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = this.parseSignature(signature, signatureFormat);
      const publicKeyBytes = new PublicKey(publicKey).toBytes();

      return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
    } catch (error) {
      throw new Error(`Failed to verify signature: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a new keypair
   */
  generateKeypair(): Keypair {
    return Keypair.generate();
  }

  /**
   * Format signature to the specified output format
   */
  private formatSignature(signature: Uint8Array, format: 'hex' | 'base58' | 'base64'): string {
    switch (format) {
      case 'hex':
        return Buffer.from(signature).toString('hex');
      case 'base58':
        return this.toBase58(signature);
      case 'base64':
        return Buffer.from(signature).toString('base64');
      default:
        throw new Error(`Unsupported output format: ${format}`);
    }
  }

  /**
   * Parse signature from the specified format
   */
  private parseSignature(signature: string, format: 'hex' | 'base58' | 'base64'): Uint8Array {
    try {
      switch (format) {
        case 'hex':
          return new Uint8Array(Buffer.from(signature, 'hex'));
        case 'base58':
          return this.fromBase58(signature);
        case 'base64':
          return new Uint8Array(Buffer.from(signature, 'base64'));
        default:
          throw new Error(`Unsupported signature format: ${format}`);
      }
    } catch (error) {
      throw new Error(`Failed to parse signature: ${error instanceof Error ? error.message : 'Invalid format'}`);
    }
  }

  /**
   * Decode private key from various formats
   */
  private decodePrivateKey(privateKey: string): Uint8Array {
    // Try base58 first (most common for Solana)
    try {
      return this.fromBase58(privateKey);
    } catch {
      // Try hex
      try {
        return new Uint8Array(Buffer.from(privateKey, 'hex'));
      } catch {
        // Try base64
        try {
          return new Uint8Array(Buffer.from(privateKey, 'base64'));
        } catch {
          throw new Error('Invalid private key format');
        }
      }
    }
  }

  /**
   * Convert bytes to base58 string
   */
  private toBase58(bytes: Uint8Array): string {
    const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let num = BigInt('0x' + Buffer.from(bytes).toString('hex'));
    
    if (num === 0n) return '1';
    
    let result = '';
    while (num > 0n) {
      const remainder = num % 58n;
      result = alphabet[Number(remainder)] + result;
      num = num / 58n;
    }
    
    // Handle leading zeros
    for (let i = 0; i < bytes.length && bytes[i] === 0; i++) {
      result = '1' + result;
    }
    
    return result;
  }

  /**
   * Convert base58 string to bytes
   */
  private fromBase58(str: string): Uint8Array {
    const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let num = 0n;
    
    for (const char of str) {
      const index = alphabet.indexOf(char);
      if (index === -1) throw new Error('Invalid base58 character');
      num = num * 58n + BigInt(index);
    }
    
    let hex = num.toString(16);
    if (hex.length % 2) hex = '0' + hex;
    
    const bytes = new Uint8Array(Buffer.from(hex, 'hex'));
    
    // Handle leading ones (zeros in original)
    let leadingOnes = 0;
    for (const char of str) {
      if (char === '1') leadingOnes++;
      else break;
    }
    
    if (leadingOnes > 0) {
      const result = new Uint8Array(leadingOnes + bytes.length);
      result.set(bytes, leadingOnes);
      return result;
    }
    
    return bytes;
  }
}
