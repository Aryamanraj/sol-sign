# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-28

### Added
- Initial release of Sol-Sign CLI tool
- Message signing with Solana keypairs
- Support for keypair files and direct private key input
- Signature verification functionality
- Keypair generation utility
- Multiple output formats (Base58, Hex, Base64)
- Comprehensive input validation
- Beautiful CLI interface with colored output
- Complete test suite with Jest
- TypeScript support
- ESLint and Prettier configuration
- Production-ready build system

### Features
- `sol-sign sign` - Sign messages with Solana keypairs
- `sol-sign verify` - Verify message signatures
- `sol-sign keypair` - Generate new Solana keypairs
- Global npm installation support
- Extensive error handling and validation
- Cross-platform compatibility

### Security
- Secure handling of private keys
- Input validation for all parameters
- Safe file operations
- No private key logging or storage
