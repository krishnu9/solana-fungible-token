import { PublicKey } from '@metaplex-foundation/js';
import {Connection, Keypair, LAMPORTS_PER_SOL, clusterApiUrl} from '@solana/web3.js';
import { config } from 'dotenv';
import { argv } from 'process';

config();
const secret = JSON.parse(process.env.PRIVATE_KEY!);

console.log("Creating Connection...");
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
console.log("Initializing payer account from pvt key...");
const payerAccount = Keypair.fromSecretKey(new Uint8Array(secret));

const AMOUNT = Number(argv[2]);
const AIRDROP_TO = argv[3] ? new PublicKey(argv[3]) : payerAccount.publicKey;

const airdropSol = async () => {
    console.log(`Airdropping ${AMOUNT} SOL to wallet ${AIRDROP_TO}`);    
    const airdropSignature = await connection.requestAirdrop(AIRDROP_TO, AMOUNT * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropSignature);
    console.log(airdropSignature);
}

airdropSol();

