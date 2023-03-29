import { getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import { Connection, Keypair, PublicKey, Transaction, clusterApiUrl } from '@solana/web3.js';
import { config } from 'dotenv';
import tokenInfo from '../token-info.json';
import tokenMetadata from '../token-metadata.json';
import getNumberDecimals from './utils/getNumberDecimals';
import { Metaplex, UploadMetadataInput, bundlrStorage, findMetadataPda, keypairIdentity } from '@metaplex-foundation/js';
import { DataV2, createCreateMetadataAccountV2Instruction } from '@metaplex-foundation/mpl-token-metadata';

config();
const secret = JSON.parse(process.env.PRIVATE_KEY!);

console.log("Creating Connection...");
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
const payerAccount = Keypair.fromSecretKey(new Uint8Array(secret));
const mintPublicKey = new PublicKey(tokenInfo.mint.PublicKey);

console.log(`Owner: ${payerAccount.publicKey.toBase58()}`);
console.log(`Token Mint Address: ${mintPublicKey.toBase58()}`);

const MY_TOKEN_METADATA: UploadMetadataInput = tokenMetadata;
const ON_CHAIN_METADATA = {
    name: MY_TOKEN_METADATA.name,
    symbol: MY_TOKEN_METADATA.symbol,
    uri: '',
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null
} as DataV2

const uploadMetadata = async (wallet:Keypair, tokenMetadata: UploadMetadataInput): Promise<string> => {
    //create metaplex instance on devnet using this wallet
    const metaplex = Metaplex.make(connection)
        .use(keypairIdentity(payerAccount))
        .use(bundlrStorage({
            address: 'https://devnet.bundlr.network',
            providerUrl: clusterApiUrl('devnet'),
            timeout: 60000,
        }));
    //Upload to Arweave
    const { uri } = await metaplex.nfts().uploadMetadata(tokenMetadata);
    console.log(`Arweave URL: `, uri);
    return uri;
}

const addMetaData = async () => {
    const MINT_CONFIG = {
        numDecimals: await getNumberDecimals(mintPublicKey),
        numberTokens: 100
    }
    console.log("Fetching Metadata PDA...");
    const metadataPDA = findMetadataPda(mintPublicKey);
    console.log(metadataPDA);
    
    console.log("Uploading Metadata to Arweave...");
    let metadataUri = await uploadMetadata(payerAccount, MY_TOKEN_METADATA)
    ON_CHAIN_METADATA.uri = metadataUri;
    // TODO: Update token details with ON_CHAIN_METADATA
    const addMetaDataTransaction = new Transaction().add(
        createCreateMetadataAccountV2Instruction({
            metadata: metadataPDA,
            mint: mintPublicKey,
            mintAuthority: payerAccount.publicKey,
            payer: payerAccount.publicKey,
            updateAuthority: payerAccount.publicKey
        },
        {
            createMetadataAccountArgsV2: {
                data: ON_CHAIN_METADATA,
                isMutable: true
            }
        })
    )
    console.log(addMetaDataTransaction);
    const transactionId = await connection.sendTransaction(addMetaDataTransaction, [payerAccount])
    console.log(`View Transaction: https://explorer.solana.com/tx/${transactionId}?cluster=devnet`);
}

addMetaData();

