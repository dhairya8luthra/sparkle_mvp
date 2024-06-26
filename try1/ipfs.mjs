import { create } from "kubo-rpc-client";

// Create a Kubo RPC client instance
const kuboClient = create({ url: "http://127.0.0.1:5001/api/v0" });

// Function to upload file to IPFS
export async function uploadToIPFS(fileContent) {
  try {
    const { cid } = await kuboClient.add(fileContent);
    console.log("File uploaded to IPFS with CID:", cid.toString());
    return cid.toString();
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    return null;
  }
}
