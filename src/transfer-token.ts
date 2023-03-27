import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token';
import { Connection, Keypair, PublicKey, clusterApiUrl, ParsedAccountData } from '@solana/web3.js';
import { config } from 'dotenv';
import tokenInfo from '../token-info.json';
import { argv} from 'process';
import getNumberDecimals from './utils/getNumberDecimals';

config();
const secret = JSON.parse(process.env.PRIVATE_KEY!);

console.log("Creating Connection...");
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
const payerAccount = Keypair.fromSecretKey(new Uint8Array(secret));
const mintPublicKey = new PublicKey(tokenInfo.mint.PublicKey);
const TRANSFER_AMOUNT = Number(argv[2]);
const recipientWalletAddress = argv[3];

console.log(`Payer Account: ${payerAccount.publicKey.toBase58()}`);
console.log(`Recipient Account: ${recipientWalletAddress}`);
console.log(`Token Mint Address: ${mintPublicKey.toBase58()}`);

const transferToken = async () => {
    const numberDecimals = await getNumberDecimals(mintPublicKey);
    const sourceAssociatedTokenAccountAddress = await getOrCreateAssociatedTokenAccount(
        connection,
        payerAccount,
        mintPublicKey,
        payerAccount.publicKey
    );
    console.log(`Source Associated Token Account address: ${sourceAssociatedTokenAccountAddress.address}`);
    const receiver = new PublicKey(recipientWalletAddress);
    const receiverAssociatedTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection, 
        payerAccount, 
        mintPublicKey, 
        receiver
    );
    console.log(`Receiver Associated Token Account address: ${receiverAssociatedTokenAccount.address}`);

    console.log('\x1b[32m','Trying transfer...');
    const transferSignature = await transfer(
        connection,
        payerAccount,
        sourceAssociatedTokenAccountAddress.address,
        new PublicKey('9WsgwBnPi1nQpnVSFrxdKfFAiCqMV9Ci8rQ91E2TYHNY'),
        new PublicKey('PMPJ1fouL9Ko3AQ9JEAPEmpC58MvmkHS5NC8NGXTY7W'),
        TRANSFER_AMOUNT * Math.pow(10, numberDecimals)
    )
    console.log(
        '\x1b[32m', //Green Text
        `   Transaction Success!🎉`,
        `\n    https://explorer.solana.com/tx/${transferSignature}?cluster=devnet`
    );
}

transferToken();

