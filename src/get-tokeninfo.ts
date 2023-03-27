import { getAccount, getAssociatedTokenAddress, getMint} from '@solana/spl-token';
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

const getTokenInfo = async () => {
    const mintInfo = await getMint(connection, mintPublicKey);
    console.log(`Token Supply: ${mintInfo.supply}`);
    console.log({mintInfo});
    const tokenAccountAddress = await getAssociatedTokenAddress(mintInfo.address, payerAccount.publicKey)
    const tokenAccountInfo = await getAccount(connection, tokenAccountAddress);
    console.log(`Associated Token Account info: `);
    console.log({tokenAccountInfo});
    const numberDecimals = await getNumberDecimals(mintPublicKey);
    console.log(`Number of Decimals in token ${mintPublicKey.toBase58()}: ${numberDecimals}`);
}

getTokenInfo();
