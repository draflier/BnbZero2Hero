# BNB Zero2Hero Assignment 1
## Task
1) Deploy an erc20 smartcontract from openzepplin
2) Deploy the rewardsStaking contract from Synthetic

## Environment
1) Node.js v16.19.0
2) npm 9.4.2
3) hardhat 2.13.0 (defined in package.json)

## To Run
1) Download source from https://github.com/draflier/bnbzero2hero_assignment_1
2) Update the contents in BNBTESTNET and MNEMONIC on the .env.sample and rename the file to .env
3) Execute the following to deploy the smartcontracts

```shell
1) cd <source_directory> 
2) npm install
3) npx hardhat run scripts/deploy.ts --network bnbtestnet

