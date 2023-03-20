import { ethers,run } from "hardhat";
//import {DA20Token } from "../typechain-types/contracts/DA20Token";

let m_addrFtRewardContract = '';
let m_addrFtLpContract = '';
let m_addrStakeContract = '';

async function main() {
  await deployRewardsToken();
  await deployLPToken();
  await deployStakingRewards();
}

async function deployRewardsToken()
{
  let accounts = await ethers.getSigners();
  //console.log(accounts);
  //console.log(accounts[0].address);
  let ftRewardContractFactory = await ethers.getContractFactory("DAR20Token");
  let ftRewardContract = await ftRewardContractFactory.deploy();
  await ftRewardContract.deployTransaction.wait(7);
  await ftRewardContract.deployed();

  try{
    await run("verify:verify", { address: ftRewardContract.address, constructorArguments: [], contract: "contracts/dar_20.sol:DAR20Token" });
  }catch(e){
      console.log(e);
  }

  console.log("FT Reward Contract deployed to:", ftRewardContract.address);
  console.log("FT Reward Contract owner address:", accounts[0].address);
  m_addrFtRewardContract = ftRewardContract.address;
}

async function deployLPToken()
{
  let accounts = await ethers.getSigners();
  //console.log(accounts);
  //console.log(accounts[0].address);
  let ftLpContractFactory = await ethers.getContractFactory("DALP20Token");
  let ftLpContract = await ftLpContractFactory.deploy();
  await ftLpContract.deployTransaction.wait(7);
  await ftLpContract.deployed();

  try{
    await run("verify:verify", { address: ftLpContract.address, constructorArguments: [], contract: "contracts/dalp_20.sol:DALP20Token" });
  }catch(e){
      console.log(e);
  }

  console.log("FT Lp Contract deployed to:", ftLpContract.address);
  console.log("FT Lp Contract owner address:", accounts[0].address);
  m_addrFtLpContract = ftLpContract.address;
}

async function deployStakingRewards()
{
  let accounts = await ethers.getSigners();
  //console.log(accounts);
  //console.log(accounts[0].address);
  let ContractFactory = await ethers.getContractFactory("StakingRewards");
  let Contract = await ContractFactory.deploy(m_addrFtRewardContract,m_addrFtLpContract);
  await Contract.deployTransaction.wait(7);
  await Contract.deployed();

  try{
    await run("verify:verify", { address: Contract.address, constructorArguments: [m_addrFtRewardContract,m_addrFtLpContract], contract: "contracts/stakingRewards.sol:StakingRewards" });
  }catch(e){
      console.log(e);
  }

  console.log("Staking Rewards Contract deployed to:", Contract.address);
  console.log("Staking Rewards Contract owner address:", accounts[0].address);
  m_addrStakeContract = Contract.address;
}




// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
