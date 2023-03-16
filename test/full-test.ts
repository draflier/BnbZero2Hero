import "@nomicfoundation/hardhat-chai-matchers";
import {expect} from "chai";
import { ethers,run } from "hardhat";

const m_AccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDZmN2QzQkQwNzUxMjcxY0FCRjA4OTdCOTM0NDdGMmQxYmJDNzFENGMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjYzNDU0NjE0MTksIm5hbWUiOiJkcmFmc29sbiJ9.qP_s6O1o7zCLujyD_BkvrAg-mMt6WycbbpulmWqEYVI';
const m_JsonRootPath = '/home/wsldev01/dev/xalts_questions/question_2/smartcontract/metadata/json/';
//const m_strOwnerAddr = '0x3126081ee598F6658eF6b1aA6A067484759DE4cA';

let m_addrFtRewardContract = '';
let m_addrFtLpContract = '';
let m_addrNftContract = '';

describe("Deploying Rewards Token", function () {
  it("Deplopying Reward contract", async function () {
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

  expect(await ftRewardContract.owner()).equal(accounts[0].address);
  });

  it("Deplopying Lp contract", async function () {
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
  
    expect(await ftLpContract.owner()).equal(accounts[0].address);
  });

  it("Deplopying Staking Rewards contract", async function () {
      let accounts = await ethers.getSigners();
      //console.log(accounts);
      //console.log(accounts[0].address);
      let ContractFactory = await ethers.getContractFactory("StakingRewards");
      let Contract = await ContractFactory.deploy();
      await Contract.deployTransaction.wait(7);
      await Contract.deployed();
    
      try{
        await run("verify:verify", { address: Contract.address, constructorArguments: [], contract: "contracts/stakingRegwards.sol:StakingRewards" });
      }catch(e){
          console.log(e);
      }
    
      console.log("FT Lp Contract deployed to:", Contract.address);
      console.log("FT Lp Contract owner address:", accounts[0].address);
      m_addrFtLpContract = Contract.address;
    
      expect(await Contract.owner()).equal(accounts[0].address);
  });

  it("Mint Not as Owner", async function () {
    let accounts = await ethers.getSigners();
    let Ft = await ethers.getContractAt("DAR20Token", m_addrFtRewardContract);
    let Ft2 = await Ft.connect(accounts[1]);
    let objTxn = await Ft2.mint(accounts[1].address,ethers.utils.parseEther("1005"));
    await objTxn.wait();

    expect (objTxn).reverted("Ownable: caller is not the owner");
  });

});
