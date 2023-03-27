import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import {Connection, Keypair, PublicKey, clusterApiUrl} from '@solana/web3.js';
import { config } from 'dotenv';
import tokenInfo from '../token-info.json';
import getNumberDecimals from './utils/getNumberDecimals';

config();
const secret = JSON.parse(process.env.PRIVATE_KEY!);

console.log("Creating Connection...");
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
const payerAccount = Keypair.fromSecretKey(new Uint8Array(secret));
const mintPublicKey = new PublicKey(tokenInfo.mint.PublicKey);

const createTokenAcc = async () => {
    const numDecimals = await getNumberDecimals(mintPublicKey);
    console.log(`Getting Associated token account information for token ${mintPublicKey}`);
    const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(connection, payerAccount, mintPublicKey, payerAccount.publicKey);    
    console.log(`Minting 500 tokens ${mintPublicKey} into Associated token account ${associatedTokenAccount.address}`);
    await mintTo(
        connection,
        payerAccount,
        mintPublicKey,
        associatedTokenAccount.address,
        payerAccount.publicKey,
        500 * Math.pow(10, numDecimals)
    );
}

createTokenAcc();
