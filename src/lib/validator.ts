import { existsSync, readFileSync } from 'fs';

/**
 * Validate if a keypair file exists and has valid format
 */
export function validateKeypairFile(keypairPath: string): boolean {
  try {
    // Check if file exists
    if (!existsSync(keypairPath)) {
      return false;
    }

    // Try to read and parse the file
    const data = readFileSync(keypairPath, 'utf8');
    const keypairData = JSON.parse(data);

    // Check if it's an array of 64 bytes (Solana keypair format)
    if (!Array.isArray(keypairData)) {
      return false;
    }

    if (keypairData.length !== 64) {
      return false;
    }

    // Check if all elements are valid bytes (0-255)
    for (const byte of keypairData) {
      if (!Number.isInteger(byte) || byte < 0 || byte > 255) {
        return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Validate private key format
 */
export function validatePrivateKey(privateKey: string): boolean {
  if (!privateKey || typeof privateKey !== 'string') {
    return false;
  }

  // Try to parse as JSON array
  try {
    const parsed = JSON.parse(privateKey);
    if (Array.isArray(parsed) && parsed.length === 64) {
      return parsed.every(byte => Number.isInteger(byte) && byte >= 0 && byte <= 255);
    }
  } catch {
    // Not JSON, continue with other validations
  }

  // Validate base58 format (common for Solana)
  if (isValidBase58(privateKey)) {
    return true;
  }

  // Validate hex format
  if (isValidHex(privateKey)) {
    return true;
  }

  // Validate base64 format
  if (isValidBase64(privateKey)) {
    return true;
  }

  return false;
}

/**
 * Check if string is valid base58
 */
function isValidBase58(str: string): boolean {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
  return base58Regex.test(str) && str.length >= 32;
}

/**
 * Check if string is valid hex
 */
function isValidHex(str: string): boolean {
  const hexRegex = /^[0-9a-fA-F]+$/;
  return hexRegex.test(str) && str.length >= 64 && str.length % 2 === 0;
}

/**
 * Check if string is valid base64
 */
function isValidBase64(str: string): boolean {
  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
}

/**
 * Validate public key format
 */
export function validatePublicKey(publicKey: string): boolean {
  if (!publicKey || typeof publicKey !== 'string') {
    return false;
  }

  // Solana public keys are base58 encoded and typically 32 bytes (44 characters in base58)
  return isValidBase58(publicKey) && publicKey.length === 44;
}

/**
 * Validate signature format
 */
export function validateSignature(signature: string, format: 'hex' | 'base58' | 'base64'): boolean {
  if (!signature || typeof signature !== 'string') {
    return false;
  }

  switch (format) {
    case 'hex':
      return isValidHex(signature) && signature.length === 128; // 64 bytes = 128 hex chars
    case 'base58':
      return isValidBase58(signature) && signature.length >= 87 && signature.length <= 88; // ~88 chars for 64 bytes
    case 'base64':
      return isValidBase64(signature) && signature.length === 88; // 64 bytes = 88 base64 chars
    default:
      return false;
  }
}
