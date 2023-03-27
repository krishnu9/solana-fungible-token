import {Connection, Keypair, PublicKey, clusterApiUrl} from '@solana/web3.js';
import { config } from 'dotenv';
import { argv } from 'process';

config();
const secret = JSON.parse(process.env.PRIVATE_KEY!);

console.log("Creating Connection...");
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
console.log("Initializing payer account from pvt key...");
const payerAccount = Keypair.fromSecretKey(new Uint8Array(secret));

const getBalance = async() => {
    const balance = await connection.getBalance(payerAccount.publicKey);
    console.log({balance});
    if(argv.length > 2) {
        const argBalance = await connection.getBalance(new PublicKey(argv[2]));
        console.log(argBalance);
    }
}

getBalance();
