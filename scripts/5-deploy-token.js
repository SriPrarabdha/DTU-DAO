import sdk from "./1-initialize-sdk.js";
import { AddressZero } from "@ethersproject/constants";

//token address : 0x6EcF7a4be4cF0d3588AF67aa1C28cF46c10F5454

const token = async () => {
    try{
        const tokenAddress = await sdk.deployer.deployToken({
            name : "DTU DAO Governance Token" ,
            symbol : "DTUOP",
            primary_sale_recipient : AddressZero
        });

        console.log("✅ Successfully deployed token module, address: " , tokenAddress);
    }
    catch(error){
        console.log("Could'nt deploy governance token " , error);
    }
}

token()