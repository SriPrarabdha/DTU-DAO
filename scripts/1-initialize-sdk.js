import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import dotenv from 'dotenv';
dotenv.config()

if(!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY===""){
    console.log("Private Key is not Found");
}
if(!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS===""){
    console.log("Wallet Address is not Found");
}
if(!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL===""){
    console.log("Alchemy Api URL is not Found");
}
const provider = new ethers.providers.JsonRpcBatchProvider(process.env.ALCHEMY_API_URL)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY , provider)
const sdk = new ThirdwebSDK(wallet) 

const f = async () => {
    try {
      const address = await sdk.getSigner().getAddress();
      console.log("👋 SDK initialized by address:", address)
    } catch (err) {
      console.error("Failed to get apps from the sdk", err);
      process.exit(1);
    }
  };
  
f();

export default sdk;