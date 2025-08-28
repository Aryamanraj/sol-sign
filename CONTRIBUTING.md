# Contributing to Sol-Sign

Thank you for your interest in contributing to Sol-Sign! We welcome contributions from the community.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Install dependencies with `npm install`
4. Create a new branch for your feature or bugfix
5. Make your changes
6. Run tests to ensure everything works
7. Submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/sol-sign.git
cd sol-sign

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run in development mode
npm run dev -- sign -m "test" -k ./test-keypair.json
```

## Code Style

We use ESLint and Prettier to maintain consistent code style:

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Testing

Please ensure all tests pass before submitting a pull request:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm run test:watch
```

## Pull Request Process

1. Ensure your code follows the existing style
2. Add tests for new functionality
3. Update documentation if needed
4. Make sure all tests pass
5. Submit a pull request with a clear description

## Reporting Issues

When reporting issues, please include:

- Operating system and version
- Node.js version
- Sol-Sign version
- Steps to reproduce the issue
- Expected vs actual behavior

## Feature Requests

We welcome feature requests! Please open an issue to discuss new features before implementing them.

## Code of Conduct

Please be respectful and constructive in all interactions. We're building this tool together for the Solana community.

## Questions?

Feel free to open an issue for any questions about contributing.
