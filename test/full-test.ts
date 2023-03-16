import "@nomicfoundation/hardhat-chai-matchers";
import {expect} from "chai";
import { ethers,run } from "hardhat";

const m_AccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDZmN2QzQkQwNzUxMjcxY0FCRjA4OTdCOTM0NDdGMmQxYmJDNzFENGMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjYzNDU0NjE0MTksIm5hbWUiOiJkcmFmc29sbiJ9.qP_s6O1o7zCLujyD_BkvrAg-mMt6WycbbpulmWqEYVI';
const m_JsonRootPath = '/home/wsldev01/dev/xalts_questions/question_2/smartcontract/metadata/json/';
//const m_strOwnerAddr = '0x3126081ee598F6658eF6b1aA6A067484759DE4cA';

let m_addrFtContract = '';
let m_addrNftContract = '';

describe("Deploying Rewards Token", function () {
  it("Deplopying contracts", async function () {
  let accounts = await ethers.getSigners();
  //console.log(accounts);
  //console.log(accounts[0].address);
  let ftContractFactory = await ethers.getContractFactory("DAR20Token");
  let ftContract = await ftContractFactory.deploy();
  await ftContract.deployTransaction.wait(7);
  await ftContract.deployed();

  try{
    await run("verify:verify", { address: ftContract.address, constructorArguments: [], contract: "contracts/dar_20.sol:DAR20Token" });
  }catch(e){
      console.log(e);
  }

  console.log("FT Contract deployed to:", ftContract.address);
  console.log("FT Contract owner address:", accounts[0].address);
  m_addrFtContract = ftContract.address;


  expect(true);
  });

  it("Mint Not as Owner", async function () {
    let accounts = await ethers.getSigners();
    let Ft = await ethers.getContractAt("DAR20Token", m_addrFtContract);
    let Ft2 = await Ft.connect(accounts[1]);
    let objTxn = await Ft2.mint(accounts[1].address,ethers.utils.parseEther("1005"));
    await objTxn.wait();

    expect (objTxn).reverted("Ownable: caller is not the owner");
  });

});
