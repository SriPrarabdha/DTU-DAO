import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop("0x8f929707813c57FfA13b281DAB277A87FA08DB86");

const config = async ()=>{
    try{
        await editionDrop.createBatch([
            {
                name:"DTU logo" ,
                description : "This NFT will give you access to DTU DAO" ,
                image : readFileSync("scripts/assets/DTU.jpg") ,
            } ,
        ])
        console.log("✅ Successfully created a new NFT in the drop!");
    }
    catch(error){
        console.log("Failed to create a new NFT " , error);
    }
}

config()