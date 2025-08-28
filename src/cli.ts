#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { SolanaMessageSigner } from './lib/signer';
import { validateKeypairFile, validatePrivateKey } from './lib/validator';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const program = new Command();

// Get version from package.json
const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8'));

program
  .name('solsigner')
  .description('Sign messages with Solana keypairs')
  .version(packageJson.version);

program
  .command('sign')
  .description('Sign a message with a Solana keypair')
  .requiredOption('-m, --message <message>', 'Message to sign')
  .option('-k, --keypair <path>', 'Path to Solana keypair JSON file')
  .option('-p, --private-key <key>', 'Private key as base58 string or array of bytes')
  .option('-o, --output <format>', 'Output format (hex, base58, base64)', 'base58')
  .option('--verify', 'Verify the signature after signing')
  .action(async (options) => {
    try {
      console.log(chalk.blue('🔐 Solsigner - Solana Message Signer\n'));

      // Validate inputs
      if (!options.keypair && !options.privateKey) {
        console.error(chalk.red('❌ Error: Either --keypair or --private-key must be provided'));
        process.exit(1);
      }

      if (options.keypair && options.privateKey) {
        console.error(chalk.red('❌ Error: Cannot use both --keypair and --private-key options'));
        process.exit(1);
      }

      const signer = new SolanaMessageSigner();
      let signature: string;
      let publicKey: string;

      if (options.keypair) {
        // Validate keypair file
        if (!validateKeypairFile(options.keypair)) {
          console.error(chalk.red('❌ Error: Invalid keypair file'));
          process.exit(1);
        }

        console.log(chalk.yellow(`📁 Using keypair file: ${options.keypair}`));
        const result = await signer.signWithKeypairFile(options.message, options.keypair, options.output);
        signature = result.signature;
        publicKey = result.publicKey;
      } else {
        // Validate private key
        if (!validatePrivateKey(options.privateKey)) {
          console.error(chalk.red('❌ Error: Invalid private key format'));
          process.exit(1);
        }

        console.log(chalk.yellow('🔑 Using provided private key'));
        const result = await signer.signWithPrivateKey(options.message, options.privateKey, options.output);
        signature = result.signature;
        publicKey = result.publicKey;
      }

      // Display results
      console.log(chalk.green('\n✅ Message signed successfully!\n'));
      console.log(chalk.cyan('📝 Message:'), options.message);
      console.log(chalk.cyan('🔑 Public Key:'), publicKey);
      console.log(chalk.cyan(`📋 Signature (${options.output}):`), signature);

      // Verify signature if requested
      if (options.verify) {
        console.log(chalk.yellow('\n🔍 Verifying signature...'));
        const isValid = await signer.verifySignature(options.message, signature, publicKey, options.output);
        
        if (isValid) {
          console.log(chalk.green('✅ Signature verification: VALID'));
        } else {
          console.log(chalk.red('❌ Signature verification: INVALID'));
          process.exit(1);
        }
      }

      console.log(chalk.blue('\n🎉 Operation completed successfully!'));
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program
  .command('verify')
  .description('Verify a signature for a message')
  .requiredOption('-m, --message <message>', 'Original message')
  .requiredOption('-s, --signature <signature>', 'Signature to verify')
  .requiredOption('-p, --public-key <key>', 'Public key to verify against')
  .option('-f, --format <format>', 'Signature format (hex, base58, base64)', 'base58')
  .action(async (options) => {
    try {
      console.log(chalk.blue('🔍 Solsigner - Signature Verification\n'));

      const signer = new SolanaMessageSigner();
      const isValid = await signer.verifySignature(
        options.message,
        options.signature,
        options.publicKey,
        options.format
      );

      console.log(chalk.cyan('📝 Message:'), options.message);
      console.log(chalk.cyan('📋 Signature:'), options.signature);
      console.log(chalk.cyan('🔑 Public Key:'), options.publicKey);

      if (isValid) {
        console.log(chalk.green('\n✅ Signature verification: VALID'));
        console.log(chalk.blue('🎉 Verification completed successfully!'));
      } else {
        console.log(chalk.red('\n❌ Signature verification: INVALID'));
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program
  .command('keypair')
  .description('Generate a new Solana keypair')
  .option('-o, --output <path>', 'Output file path for the keypair')
  .option('--public-key-only', 'Only display the public key')
  .action(async (options) => {
    try {
      console.log(chalk.blue('🔐 Solsigner - Keypair Generator\n'));

      const signer = new SolanaMessageSigner();
      const keypair = signer.generateKeypair();

      if (options.publicKeyOnly) {
        console.log(chalk.cyan('🔑 Public Key:'), keypair.publicKey.toBase58());
      } else {
        console.log(chalk.cyan('🔑 Public Key:'), keypair.publicKey.toBase58());
        console.log(chalk.cyan('🔐 Private Key:'), Buffer.from(keypair.secretKey).toString('base64'));
        
        if (options.output) {
          const keypairArray = Array.from(keypair.secretKey);
          const fs = await import('fs');
          fs.writeFileSync(options.output, JSON.stringify(keypairArray));
          console.log(chalk.green(`💾 Keypair saved to: ${options.output}`));
        } else {
          console.log(chalk.yellow('\n💡 Tip: Use --output <path> to save the keypair to a file'));
        }
      }

      console.log(chalk.blue('\n🎉 Keypair generation completed!'));
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program.parse();
