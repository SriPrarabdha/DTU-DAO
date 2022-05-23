import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getEditionDrop("0x8f929707813c57FfA13b281DAB277A87FA08DB86")

const fo = async ()=> {
    try{
        const claimConditions = [{
            startTime : new Date() ,
            maxQuantity : 50_000 ,
            price : 0 ,
            quantityLimitPerTransaction : 1 ,
            waitInSeconds : MaxUint256
        }]

        await editionDrop.claimConditions.set("0" , claimConditions)
        console.log("✅ Successfully set claim condition!");
    }
    catch(error){
        console.log("Failed to set claim condition : " , error);
    }
}

fo()