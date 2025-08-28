# Publishing Guide for Sol-Sign

This guide will walk you through publishing your Sol-Sign package to npm.

## Pre-Publishing Checklist

### 1. Update Package Information
```bash
# Update package.json with your details
nano package.json
```

Update these fields:
- `name`: Make sure it's unique on npm (check with `npm view sol-sign`)
- `author`: Your name and email
- `repository.url`: Your GitHub repository URL
- `bugs.url`: Your GitHub issues URL
- `homepage`: Your GitHub repository URL

### 2. Verify Everything Works

```bash
# Run all tests
npm test

# Build the project
npm run build

# Test CLI locally
npm link
sol-sign --version
sol-sign keypair --public-key-only

# Test signing with special characters (use single quotes for special chars)
sol-sign sign -m 'Hello World!' -k test-keypair.json
```

### 3. Update Version (if needed)
```bash
# For patch releases (1.0.0 -> 1.0.1)
npm version patch

# For minor releases (1.0.0 -> 1.1.0)
npm version minor

# For major releases (1.0.0 -> 2.0.0)
npm version major
```

## Publishing Steps

### 1. Create npm Account
If you don't have an npm account:
```bash
npm adduser
```

Or login if you have one:
```bash
npm login
```

### 2. Verify Package Contents
```bash
# See what will be published
npm pack --dry-run

# This should include:
# - dist/ (compiled JavaScript)
# - README.md
# - LICENSE
# - package.json
```

### 3. Publish to npm

#### For first release:
```bash
npm publish
```

#### For scoped packages (if you want @yourname/sol-sign):
```bash
npm publish --access public
```

### 4. Verify Publication
```bash
# Check if published successfully
npm view sol-sign

# Test installation
npm install -g sol-sign
sol-sign --version
```

## Alternative Package Names

If `sol-sign` is taken, here are some alternatives:
- `solana-message-signer`
- `sol-msg-sign` 
- `solana-sign-cli`
- `@yourname/sol-sign` (scoped package)

To check availability:
```bash
npm view package-name
# If it returns an error, the name is available
```

## Shell Escaping Tips

When using special characters in messages:

```bash
# Use single quotes for messages with special characters
sol-sign sign -m 'Hello World!' -k keypair.json

# For messages with single quotes, use double quotes and escape
sol-sign sign -m "Don\'t forget to escape" -k keypair.json

# For complex messages, create a file
echo "Complex message with symbols: !@#$%^&*()" > message.txt
sol-sign sign -m "$(cat message.txt)" -k keypair.json
```

## Post-Publishing

### 1. Create GitHub Release
1. Go to your GitHub repository
2. Click "Releases" → "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: `Sol-Sign v1.0.0`
5. Describe the features and changes

### 2. Update Documentation
- Add installation badge to README
- Update version numbers if needed
- Add to Solana community resources

### 3. Test Global Installation
```bash
# Unlink development version
npm unlink sol-sign

# Install from npm
npm install -g sol-sign

# Test it works
sol-sign --version
sol-sign keypair --public-key-only
```

## CI/CD Setup (Optional)

The project includes GitHub Actions that will:
- Run tests on every push/PR
- Automatically publish on releases

To enable automatic publishing:
1. Get npm auth token: `npm token create`
2. Add to GitHub Secrets as `NPM_TOKEN`
3. Create a release on GitHub to trigger auto-publish

Your Sol-Sign package is now ready for publication! 🚀
