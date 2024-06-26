import express from "express";
import ethers from "ethers";
import contractData from "./contract.json" assert { type: "json" };
const contractABI = contractData.abi;
const contractAddress = contractData.address;
import mysql from "mysql2/promise";
import { writeFile } from "fs/promises";
import { uploadToIPFS } from "./ipfs.mjs";

const app = express();

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "test",
});

// Connect to your Ethereum node or provider
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// Function to convert query results to CSV
function convertToCSV(results, fields) {
  // Header row
  let csv = fields.map((field) => field.name).join(",") + "\n";

  // Data rows
  results.forEach((row) => {
    csv += Object.values(row).join(",") + "\n";
  });

  return csv;
}

// Listen for the QuerySubmitted event
contract.on("QuerySubmitted", async (queryId, userId, sqlQuery) => {
  console.log(`Query ID: ${queryId}`);
  console.log(`User ID: ${userId}`);
  console.log(`SQL Query: ${sqlQuery}`);

  const csvFilePath = `query_${queryId}_results.csv`;

  try {
    const [results, fields] = await connection.execute(sqlQuery);

    console.log("Query results:", results);
    const csv = convertToCSV(results, fields);

    // Write CSV to file
    await writeFile(csvFilePath, csv);

    console.log(`CSV file saved as ${csvFilePath}`);

    // Upload CSV file to IPFS
    const ipfsCID = await uploadToIPFS(csv);

    // Call function to update IPFS CID in the smart contract
    await updateIPFSCID(queryId, ipfsCID);

    // Respond with the IPFS CID
    console.log("IPFS CID:", ipfsCID);
  } catch (error) {
    console.error("Error executing SQL query:", error);
  }
});

async function updateIPFSCID(queryId, ipfsCID) {
  const contractWithSigner = contract.connect(provider.getSigner());
  try {
    const tx = await contractWithSigner.updateQueryIPFSCID(queryId, ipfsCID);
    await tx.wait();
    console.log(
      `IPFS CID ${ipfsCID} for query ID ${queryId} updated successfully`
    );
  } catch (error) {
    console.error("Error updating IPFS CID:", error);
  }
}

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
