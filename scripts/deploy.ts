import { ethers,run } from "hardhat";
//import {DA20Token } from "../typechain-types/contracts/DA20Token";

async function main() {
  console.log("deploying contract...");
  const [owner] = await ethers.getSigners();
  const contractFactory = await ethers.getContractFactory("DA20Token");
  const contract = await contractFactory.deploy();
  await contract.deployTransaction.wait(7);
  let objDA20Token = await contract.deployed();


  try{
    await run("verify:verify", { address: contract.address, constructorArguments: [], contract: "contracts/da_20.sol:DA20Token" });
  }catch(e){
      console.log(e);
  }

  console.log("Digital Asset 20 Token Contract deployed to:", contract.address);
  console.log("Digital Asset 20 Contract owner address:", owner.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
