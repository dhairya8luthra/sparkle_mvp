const express = require('express');
const ethers = require('ethers');
const redis = require('redis');

const app = express();
const port = 3000;

// Redis configuration
const redisClient = redis.createClient();

// Contract configuration
const contractAddress = '0x...'; // Replace with your contract address
const contractABI = [...]; // Replace with your contract ABI

// Connect to Ethereum node or provider
const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// Event listener for ValueSet
contract.on('ValueSet', (key, value) => {
  console.log(`Value set in contract: Key=${key}, Value=${value}`);
});

// Function to set a value in Redis and call the contract
async function setValueInRedis(key, value) {
  try {
    // Set the value in Redis
    await redisClient.set(key, value);

    // Call the contract function to set the value
    const contractWithSigner = contract.connect(provider.getSigner());
    const tx = await contractWithSigner.setValue(key, value);
    await tx.wait();
    console.log(`Value set in Redis and contract: Key=${key}, Value=${value}`);
  } catch (error) {
    console.error(error);
  }
}

// Function to get a value from the contract
async function getValueFromContract(key) {
  try {
    // Call the contract function to get the value
    const value = await contract.getValue(key);
    console.log(`Value fetched from contract: Key=${key}, Value=${value}`);
    return value;
  } catch (error) {
    console.error(error);
  }
}

// Example usage
setValueInRedis('myKey', 'myValue');
getValueFromContract('myKey');

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});