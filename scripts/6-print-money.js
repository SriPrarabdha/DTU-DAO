import sdk from "./1-initialize-sdk.js";

// This is the address of our ERC-20 contract printed out in the step before.
const token = sdk.getToken("0x6EcF7a4be4cF0d3588AF67aa1C28cF46c10F5454");

const money = async () => {
  try {
    // What's the max supply you want to set? 1,000,000 is a nice number!
    const amount = "1000000";
    // Interact with your deployed ERC-20 contract and mint the tokens!
    await token.mintTo("0x13B1921864239E3313e035deE67Daa182f470A02" , amount);
    const totalSupply = await token.totalSupply();

    // Print out how many of our token's are out there now!
    console.log("✅ There now is", totalSupply.displayValue, "$DTUOP in circulation");
  } catch (error) {
    console.error("Failed to print money", error);
}
}

money();