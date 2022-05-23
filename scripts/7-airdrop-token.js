import { log } from 'util';
import sdk from './1-initialize-sdk.js'

const editionDrop = sdk.getEditionDrop("0x8f929707813c57ffa13b281dab277a87fa08db86");

const token = sdk.getToken("0x6EcF7a4be4cF0d3588AF67aa1C28cF46c10F5454")

const airdrop = async () =>{
    try{
        const walletAddress =  await editionDrop.history.getAllClaimerAddresses(0);
        if(walletAddress===0){
            console.log("✅ No NFTs claimed yet . Maybe get some friends to claim free NFT");
            process.exit(0);
        }

        const airDropTargets = walletAddress.map((address) => {
            const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000)
            console.log("Going to airdrop " , randomAmount , "token to " , address);

            const airDropTarget = {
                toAddress : address ,
                amount : randomAmount
            }

            return airDropTarget
        } )

        console.log("🌈 Starting the airdrop...");
        await token.transferBatch(airDropTargets)
        console.log("Token transferred to all the DAO members");
        

    }
    catch(err){
        console.log("Coluldn't airdrop tokens : " , err);
    }
}

airdrop()