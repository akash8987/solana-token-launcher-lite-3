const { Connection, Keypair, clusterApiUrl, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { createMint, getOrCreateAssociatedTokenAccount, mintTo } = require('@solana/spl-token');
const bs58 = require('bs58');

// --- CONFIGURATION ---
const RPC_ENDPOINT = clusterApiUrl('devnet');
const PRIVATE_KEY_BASE58 = 'YOUR_PRIVATE_KEY_HERE'; // Replace with your secret key

async function launchToken() {
    // 1. Setup Connection and Wallet
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    const payer = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY_BASE58));

    console.log(`Starting deployment from: ${payer.publicKey.toBase58()}`);

    // 2. Create New Token Mint
    // 
    console.log("Creating token mint...");
    const mint = await createMint(
        connection,
        payer,            // Payer of the transaction
        payer.publicKey,  // Mint Authority
        payer.publicKey,  // Freeze Authority
        9                 // Decimals (9 is standard for SOL-like tokens)
    );

    console.log(`Token Mint Created: ${mint.toBase58()}`);

    // 3. Create Associated Token Account (ATA) for the payer
    console.log("Creating Token Account...");
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        payer.publicKey
    );

    console.log(`Token Account Address: ${tokenAccount.address.toBase58()}`);

    // 4. Mint Tokens to the account
    console.log("Minting 1000 tokens...");
    await mintTo(
        connection,
        payer,
        mint,
        tokenAccount.address,
        payer,
        1000000000000 // 1000 tokens with 9 decimals
    );

    console.log("Success! Token launched and minted.");
}

launchToken().catch(console.error);
