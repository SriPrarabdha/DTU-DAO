import sdk from './1-initialize-sdk.js';

const vote = sdk.getVote("0x45C521deE693a7F5c432463d1f922F9ff9349028")

const token = sdk.getToken("0x6EcF7a4be4cF0d3588AF67aa1C28cF46c10F5454")

const transfer = async () => {
    try{
        await token.roles.grant("minter" , vote.getAddress());
        console.log("Successfully gave Voting Contract permission to act on token contract");
    }catch(error){
        console.log("Couldn't give Voting Contract permission to act on token contract " , error);
        process.exit(1);
    }
    try{
        const ownedTokenBalance = await token.balanceOf(process.env.WALLET_ADDRESS)

        const ownedAmount = ownedTokenBalance.displayValue;
        const percent90 = ownedAmount* 0.9

        await token.transfer(vote.getAddress() , percent90)

        console.log("✅ Succesfully transferred " + percent90 + " tokens to Voting Contract");
    }catch(err){
        console.log("Couldn't transfer tokens to Voting Contract " , err);
    }
}

transfer()