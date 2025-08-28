# Solsigner

A production-grade CLI tool for signing messages with Solana keypairs. Simple, secure, and easy to use.

[![npm version](https://badge.fury.io/js/solsigner.svg)](https://badge.fury.io/js/solsigner)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔐 **Sign messages** with Solana keypairs from JSON files or private keys
- ✅ **Verify signatures** to ensure message authenticity
- 🔑 **Generate new keypairs** for development and testing
- 📋 **Multiple output formats** (Base58, Hex, Base64)
- 🛡️ **Input validation** for security and reliability
- 🎨 **Beautiful CLI interface** with colored output
- 🧪 **Production-ready** with comprehensive tests

## Installation

### Global Installation (Recommended)

```bash
npm install -g solsigner
```

### Local Installation

```bash
npm install solsigner
```

## Quick Start

### Sign a Message with Keypair File

```bash
solsigner sign -m "Hello, Solana!" -k ./my-keypair.json
```

### Sign a Message with Private Key

```bash
solsigner sign -m "Hello, Solana!" -p "your-private-key-here"
```

### Verify a Signature

```bash
solsigner verify -m "Hello, Solana!" -s "signature-here" -p "public-key-here"
```

### Generate a New Keypair

```bash
solsigner keypair
solsigner keypair -o ./new-keypair.json
```

## Shell Escaping for Special Characters

When your message contains special characters like `!`, `$`, or quotes, use proper escaping:

```bash
# Use single quotes for messages with exclamation marks
solsigner sign -m 'Hello World!' -k ./keypair.json

# Use double quotes and escape for single quotes
solsigner sign -m "Don\'t forget this" -k ./keypair.json

# For complex messages, you can use a file
echo "Complex message: !@#$%^&*()" > message.txt
solsigner sign -m "$(cat message.txt)" -k ./keypair.json
```

## Usage

### Signing Messages

#### Using Keypair File
```bash
# Basic signing
sol-sign sign --message "Your message" --keypair ./keypair.json

# With different output formats
sol-sign sign -m "Your message" -k ./keypair.json -o hex
sol-sign sign -m "Your message" -k ./keypair.json -o base64

# With signature verification
sol-sign sign -m "Your message" -k ./keypair.json --verify
```

#### Using Private Key
```bash
# With base58 private key
sol-sign sign -m "Your message" -p "5Kd3NBUAdUnhyzenEwVLy9pBKxSwXvE9FMPyR4UKZvpe6E6VTjLjyBXhF"

# With JSON array private key
sol-sign sign -m "Your message" -p '[1,2,3,...,64]'
```

### Verifying Signatures

```bash
# Basic verification
sol-sign verify --message "Your message" --signature "signature-here" --public-key "public-key-here"

# With different signature formats
sol-sign verify -m "Your message" -s "hex-signature" -p "public-key" -f hex
sol-sign verify -m "Your message" -s "base64-signature" -p "public-key" -f base64
```

### Generating Keypairs

```bash
# Generate and display keypair
sol-sign keypair

# Save keypair to file
sol-sign keypair --output ./my-new-keypair.json

# Only show public key
sol-sign keypair --public-key-only
```

## Command Reference

### `solsigner sign`

Sign a message with a Solana keypair.

**Options:**
- `-m, --message <message>` - Message to sign (required)
- `-k, --keypair <path>` - Path to Solana keypair JSON file
- `-p, --private-key <key>` - Private key as base58 string or array of bytes
- `-o, --output <format>` - Output format: hex, base58, base64 (default: base58)
- `--verify` - Verify the signature after signing

**Examples:**
```bash
solsigner sign -m "Hello World" -k ./keypair.json
solsigner sign -m "Hello World" -p "your-private-key" -o hex --verify
```

### `solsigner verify`

Verify a signature for a message.

**Options:**
- `-m, --message <message>` - Original message (required)
- `-s, --signature <signature>` - Signature to verify (required)
- `-p, --public-key <key>` - Public key to verify against (required)
- `-f, --format <format>` - Signature format: hex, base58, base64 (default: base58)

**Examples:**
```bash
solsigner verify -m "Hello World" -s "signature-here" -p "public-key-here"
solsigner verify -m "Hello World" -s "hex-signature" -p "public-key" -f hex
```

### `solsigner keypair`

Generate a new Solana keypair.

**Options:**
- `-o, --output <path>` - Output file path for the keypair
- `--public-key-only` - Only display the public key

**Examples:**
```bash
solsigner keypair
solsigner keypair -o ./new-keypair.json
solsigner keypair --public-key-only
```

## Output Formats

Solsigner supports three output formats for signatures:

- **base58** (default) - Standard Solana format
- **hex** - Hexadecimal encoding
- **base64** - Base64 encoding

## Security Best Practices

1. **Never share your private keys** - Keep them secure and private
2. **Use keypair files** when possible instead of passing private keys as arguments
3. **Verify signatures** when security is critical
4. **Use strong keypairs** - Generate them with `sol-sign keypair`

## Keypair File Format

Solsigner expects Solana keypair files in the standard JSON array format:

```json
[1, 2, 3, ..., 64]
```

This is a 64-byte array where the first 32 bytes are the private key and the last 32 bytes are the public key.

## Error Handling

Solsigner provides clear error messages for common issues:

- Invalid keypair file format
- Missing or incorrect private keys
- File not found errors
- Invalid signature formats
- Network connectivity issues

## Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/Aryamanraj/solsigner.git
cd solsigner

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run in development mode
npm run dev sign -m "test message" -k ./test-keypair.json
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

### Linting and Formatting

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## API Reference

Sol-Sign can also be used as a library in your Node.js projects:

```typescript
import { SolanaMessageSigner } from 'solsigner';

const signer = new SolanaMessageSigner();

// Sign with keypair file
const result = await signer.signWithKeypairFile('message', './keypair.json');

// Sign with private key
const result2 = await signer.signWithPrivateKey('message', 'private-key');

// Verify signature
const isValid = await signer.verifySignature('message', 'signature', 'public-key');

// Generate keypair
const keypair = signer.generateKeypair();
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/Aryamanraj/sol-sign#readme)
- 🐛 [Report Issues](https://github.com/Aryamanraj/sol-sign/issues)
- 💬 [Discussions](https://github.com/Aryamanraj/sol-sign/discussions)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

---

Made with ❤️ for the Solana community
