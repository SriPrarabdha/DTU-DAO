import { AddressZero } from "@ethersproject/constants";
import { readFileSync } from "fs";
import sdk from "./1-initialize-sdk.js";

//contrac deployed at 0x8f929707813c57ffa13b281dab277a87fa08db86

const drop = async ()=>{
    try{
        const editionDropAddress = await sdk.deployer.deployEditionDrop({

            name : "DTU DAO MEMBERSHIP" ,
            description : "A DAO for all DTU Students" ,
            image : readFileSync("scripts/assets/DTU.jpg") ,
            primary_sale_recipient : AddressZero
        });

        const editionDrop = sdk.getEditionDrop(editionDropAddress)

        const metadata = await editionDrop.metadata.get()

        console.log("✅ Successfully deployed editionDrop contract, address:",editionDropAddress);
        console.log("✅ editionDrop metadata:", metadata);
    }
    catch(error){
        console.log("Failed to deploy the editionDrop contract " , error);
    }
}

drop()
