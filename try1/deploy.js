const fs = require("fs");
const { ethers } = require("hardhat"); // Import ethers from Hardhat

async function main() {
  const provider = ethers.provider; // Get provider from Hardhat's ethers object
  const signer = await ethers.getSigner();

  const SQLQueryContract = await ethers.getContractFactory("SQLQueryContract");
  const contract = await SQLQueryContract.deploy();
  await contract.deployed();

  console.log("Contract deployed to:", contract.address);

  const data = JSON.stringify(
    {
      address: contract.address,
      abi: contract.interface.format("json"),
    },
    null,
    2
  );

  fs.writeFileSync("contract.json", data);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
