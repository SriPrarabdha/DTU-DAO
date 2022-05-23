import sdk from './1-initialize-sdk.js';

//deployed at : 0x45C521deE693a7F5c432463d1f922F9ff9349028

const vote = async () => {
    try{
        const voteContractAddress = await sdk.deployer.deployVote({
            name : 'DTU DAO' ,
            voting_token_address : "0x6EcF7a4be4cF0d3588AF67aa1C28cF46c10F5454" ,
            voting_delay_in_blocks : 0 ,
            voting_period_in_blocks : 6570 , 
            voting_quorum_fraction : 0 ,
            proposal_token_threshold : 0 ,
        })

        console.log("✅ Voting Contract successfully deployed at : " , voteContractAddress);
    }
    catch(err){
        console.log("Couldn't deploy the voting Contract " , err);
    }
}

vote()