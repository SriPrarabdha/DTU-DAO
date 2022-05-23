import React, { useMemo } from "react";
import {useAddress , useMetamask , useEditionDrop , useToken , useVote , useNetwork } from '@thirdweb-dev/react'
import { useEffect, useState } from "react";
import { AddressZero } from "@ethersproject/constants";
import { ChainId } from "@thirdweb-dev/sdk";

const App = () => {

  const adress = useAddress();
  const network = useNetwork();
  const connectWithMetamask = useMetamask();
  console.log("address : " , adress);

  const editionDrop = useEditionDrop("0x8f929707813c57FfA13b281DAB277A87FA08DB86")
  const token = useToken("0x6EcF7a4be4cF0d3588AF67aa1C28cF46c10F5454")
  const vote = useVote("0x45C521deE693a7F5c432463d1f922F9ff9349028")

  const [hasClaimedNFT , setHasClaimedNFT] = useState(false)
  const [isClaiming , setIsClaiming] = useState(false)

  const [memberTokenAmount , setMemberTokenAmount] = useState([])
  const [memberAddress , setMemberAddress] = useState([])

  const [proposals , setProposals] = useState([])
  const [isVoting , setIsVoting] = useState(false)
  const [hasVoted , setHasVoted] = useState(false)

  const shortenAddress = (str) => {
    return str.substring(0,6) + "....." + str.substring(str.length-4)
  }

  useEffect(() => {
    if(!hasClaimedNFT){
      return;
    }

    const getAllProposals = async () => {
      try{
        const proposals = await vote.getAll();
        setProposals(proposals);
        console.log("🌈 All Proposals : " , proposals);
      }catch(error){
        console.log("Failed to get Proposals");
      }
    }
    getAllProposals()
  } , [vote , hasClaimedNFT])

  useEffect(() => {
    if(!hasClaimedNFT){
      return;
    }

    if(!proposals.length){
      return
    }

    const checkIfUserHasVoted  =async () => {
      try{
        const hasVoted  = await vote.hasVoted(proposals[0].proposalId , adress)
        setHasVoted(hasVoted);
        if(hasVoted){
          console.log("🥵 User has already voted");
        }else{
          console.log("🙂 User have not voted yet");
        }
      }catch(error){
        console.log("Failed to check if wallet has voted " , error);
      }
    }
    checkIfUserHasVoted();
  } , [vote  ,hasClaimedNFT , proposals , adress])

  useEffect(() =>{
    if(!adress){
      return;
    }

    const checkBalance = async ()=> {
      try{
        const balance = await editionDrop.balanceOf(adress , 0)

        if(balance.gt(0)){
          setHasClaimedNFT(true)
          console.log("🌟 This User has the membership NFT");
        }
        else{
          setHasClaimedNFT(false);
          console.log("😭 This User does'nt have the membership NFT");
        }
      }
      catch(error){
        setHasClaimedNFT(false);
        console.error("Failed to get the balance " , error);
      }
    };

    checkBalance();
  } , [adress , editionDrop]);

  useEffect(() => {
    if(!adress){
      return;
    }

    const getAllAddress = async () => {
      try{
        const memberAddress = await editionDrop.history.getAllClaimerAddresses(0);
        setMemberAddress(memberAddress)
        console.log("🚀 Members Addresses " , memberAddress);
      }
      catch(err){
        console.log("There was an error in logging meber's address : " , err);
      }
    } ;
    getAllAddress()
  } , [editionDrop.history , hasClaimedNFT])

  useEffect(() => {
    if(!hasClaimedNFT){
      return;
    }

    const getAllBalances = async ()=> {
      try{
        const amounts = await token.history.getAllHolderBalances()
        setMemberTokenAmount(amounts)
        console.log("👜 Token Amounts : " , amounts);
      }
      catch(err){
        console.log("Couldn't get token amounts : " , err);
      }
    };
    getAllBalances()
  } , [token.history , hasClaimedNFT]);

  const memberList = useMemo(() =>{
    return memberAddress.map((address)=>{
      const member = memberTokenAmount?.find(({holder}) => holder === address)

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      }
    })
  },[memberAddress , memberTokenAmount] )

  const mintNFT = async ()=> {
    try{
      setIsClaiming(true)
      await editionDrop.claim("0" , 1)
      console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setHasClaimedNFT(true)

    }catch(error){
      setHasClaimedNFT(false)
      console.log("Couldn't mint the membership NFT : " , error);
    }finally{
      setIsClaiming(false)
    }
  }

  if (adress && (network?.[0].data.chain.id !== ChainId.Rinkeby)) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>
          This dapp only works on the Rinkeby network, please switch networks
          in your connected wallet.
        </p>
      </div>
    );
  }

  if(!adress){
    return(
      <div className="landing">
        <h1>Welcome to DTU DAO</h1>
        <button onClick={connectWithMetamask} className="btn-hero">Connect Your Wallet</button>
      </div>
    )
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <img src=".../scripts/assets/DTU.jpg" />
        <h1>DTU DAO Member Page</h1>
        <p>Congratulations on being a member</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Active Proposals</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                //before we do async things, we want to disable the button to prevent double clicks
                setIsVoting(true);

                // lets get the votes from the form for the values
                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    //abstain by default
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    );

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                // first we need to make sure the user delegates their token to vote
                try {
                  //we'll check if the wallet still needs to delegate their tokens before they can vote
                  const delegation = await token.getDelegationOf(adress);
                  // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                  if (delegation === AddressZero) {
                    //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    await token.delegateTo(adress);
                  }
                  // then we need to vote on the proposals
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        // before voting we first need to check whether the proposal is open for voting
                        // we first need to get the latest state of the proposal
                        const proposal = await vote.get(proposalId);
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if it is open for voting, we'll vote on it
                          return vote.vote(proposalId, _vote);
                        }
                        // if the proposal is not open for voting we just return nothing, letting us continue
                        return;
                      })
                    );
                    try {
                      // if any of the propsals are ready to be executed we'll need to execute them
                      // a proposal is ready to be executed if it is in state 4
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          // we'll first get the latest state of the proposal again, since we may have just voted before
                          const proposal = await vote.get(proposalId);

                          //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                          if (proposal.state === 4) {
                            return vote.execute(proposalId);
                          }
                        })
                      );
                      // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                      setHasVoted(true);
                      // and log out a success message
                      console.log("successfully voted");
                    } catch (err) {
                      console.error("failed to execute votes", err);
                    }
                  } catch (err) {
                    console.error("failed to vote", err);
                  }
                } catch (err) {
                  console.error("failed to delegate tokens");
                } finally {
                  // in *either* case we need to set the isVoting state to false to enable the button again
                  setIsVoting(false);
                }
              }}
            >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({ type, label }) => (
                      <div key={type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + type}
                          name={proposal.proposalId}
                          value={type}
                          //default the "abstain" vote to checked
                          defaultChecked={type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + type}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? "Voting..."
                  : hasVoted
                    ? "You Already Voted"
                    : "Submit Votes"}
              </button>
              {!hasVoted && (
                <small>
                  This will trigger multiple transactions that you will need to
                  sign.
                </small>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mint-nft">
      <h1>Mint your free 🍪DAO Membership NFT</h1>
      <button onClick={mintNFT} disabled={isClaiming}>
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
      
    </div>
  );
};

export default App;
