# Create Fungible Token in Solana - @solana/web3.js
## 1. Install Solana CLI
Install the Solana Tool Suite by running the following from a command-line shell:
```sh
sh -c "$(curl -sSfL https://release.solana.com/v1.15.2/install)"
```
See [Solana Documentation](https://docs.solana.com/cli/install-solana-cli-tools)
## 2. Create Command-Line Wallet
Create a command-line wallet (keypair) as a file system wallet. To generate a File System Wallet Keypair, run:
```sh
solana-keygen new --outfile <any-dir-for-wallets>/keypair.json
```
View the public key created in the keypair by running:
```sh
solana-keygen pubkey <path-to-wallet>/keypair.json
```
To view the private key created in the keypair, run:
```sh
cat <path-to-wallet>/keypair.json
```
Use this keypair as the __payer__ and __mint authority__ going forward.
> Copy this private key and paste it in `.env` file in root directory\
> Content in `.env` should look like:
> ```
> PRIVATE_KEY=[101,244,196,154,31,9,11,242...]
>```

## 3. Create and transfer fungible tokens
### Airdrop SOL into wallet by specifying public key.
```sh
solana airdrop <amount> <recipient_public_key>
```
OR
```sh
ts-node src/airdrop.ts <amount> <recipient_public_key>
```
Skip `<recipient_public_key>` argument to airdrop SOL into the wallet created earlier (`private_key` of which is stored in `.env`) \
To check token balance in the specified wallet address (public key), run:
```sh
ts-node src/get-balance <public_key>
```
### Create token **mint**

Run the following create a new token (mint):
```sh
ts-node src/create-token.ts
```
This writes the `public_key` of the mint into `token-info.json`

### Create **Associated Token Account** and start Minting tokens
To start minting tokens using the *mint* created in the last step, an *Associated Token Account* for the mint needs to be created. Run the following in the CLI to create an ATA and mint 500 tokens into it.
```sh
ts-node src/create-ata-and-mint-tokens.ts
```

### Add Metadata to the token
To view the token in [Solana Explorer](https://explorer.solana.com/?cluster=devnet) or other mobile/desktop wallets, we need to add metadata to the new token. Metadata include any arbitary name, symbol and description you choose along with a public url to an image. \
Specify the metadata details in `token-metadata.json` file in the following format:
```json
{
    "name": "Captain Levi Token",
    "symbol": "LEVI",
    "description": "I want to put an end to that recurring nightmare, right now. There are those who would get in my way. But I'm fine playing the role of the lunatic who kills people like that. I have to be ready to rearrange some faces. Because I choose the hell of humans killing each other over the hell of being eaten. --Levi Ackerman",
    "image": "https://avatars.githubusercontent.com/u/39588858?v=4"
}
```
Run the following to add metadata to the token.
```sh
ts-node src/addMetaData.ts
```

### Transfer tokens to another wallet
Transfer any amount of tokens into any wallet by specifying the `public_key` of the recipient. Run:
```sh
ts-node src/transfer-token.ts <amount> <recipient_public_key>
#Example:
#ts-node src/transfer-token.ts 3 8H2zN6dWffQgPE6HDac1ZFL9HBL7C3Hx6SgY3qifiCXC
```
You should see success message in the terminal like: 
<span style="color: green">
```sh
 Trying transfer...
    Transaction Success!🎉
    https://explorer.solana.com/tx/2ZPYqAUmtWZVwwMpWCuCorj3jhQ2EC7DWNZcXgNbWSisbuTujkD2CBLAJTrVs3shYTM874zjcXc2do88rgRmYfuF?cluster=devnet
```
</span>
Visit the link in the message to view your transaction in the Solana Explorer.

Thanks 😉
