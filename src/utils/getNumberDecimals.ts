import { Connection, ParsedAccountData, PublicKey, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

async function getNumberDecimals(mintPublicKey: PublicKey):Promise<number> {
    const info = await connection.getParsedAccountInfo(mintPublicKey);
    const result = (info.value?.data as ParsedAccountData).parsed.info.decimals as number;
    return result;
}

export default getNumberDecimals;
