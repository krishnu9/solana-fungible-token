import { createMint } from '@solana/spl-token';
import {Connection, Keypair, clusterApiUrl} from '@solana/web3.js';
import { config } from 'dotenv';
import { writeFileSync } from 'fs';
import { join } from 'path';

config();
const secret = JSON.parse(process.env.PRIVATE_KEY!);

console.log("Creating Connection...");
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
const payerAccount = Keypair.fromSecretKey(new Uint8Array(secret));

const createTokenMint = async () => {
    console.log("Creating Token Mint...");
    const mint = await createMint(
        connection,
        payerAccount,
        payerAccount.publicKey,
        payerAccount.publicKey,
        9
    );
    console.log({mint});
    writeFileSync(join(__dirname, "../token-info.json"), JSON.stringify({mint: {PublicKey: mint}}), {flag: "w"})
}

createTokenMint();

