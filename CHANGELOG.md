## [1.2.0] - 2025-08-28

### Changes
- feat: document automatic CI/CD pipeline capabilities

- fix: add proper permissions for GitHub Actions bot
- fix: handle initial release case in automatic versioning
- feat: implement automatic version bumping and enhanced CI/CD
- feat: rename package to 'js-sol-sign' for better npm availability
- feat: rename package to 'solsigner' for npm availability
- fix: resolve ESLint configuration and TypeScript compatibility issues
- fix: update author name in package.json
- docs: add contributor guidelines and release process
- docs: add comprehensive documentation and licensing
- ci: add GitHub Actions workflow for CI/CD
- chore: configure code quality tools and git settings
- test: add comprehensive test suite with Jest
- feat: add comprehensive CLI interface with commander.js
- feat: implement core Solana message signing functionality
- feat: initial project setup with TypeScript configuration


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
