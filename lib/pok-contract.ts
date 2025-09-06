import { ethers } from "ethers"

const POK_CONTRACT_ABI = [
  "function mintPOK(address to, string memory tokenURI) public returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function balanceOf(address owner) public view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
]

export async function mintPOK(userAddress: string, tokenURI: string): Promise<{ txHash: string; tokenId: string }> {
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is not configured")
  }

  if (!process.env.NEXT_PUBLIC_RPC_URL) {
    throw new Error("NEXT_PUBLIC_RPC_URL is not configured")
  }

  if (!process.env.NEXT_PUBLIC_QUIZ_CONTRACT_ADDRESS) {
    throw new Error("NEXT_PUBLIC_QUIZ_CONTRACT_ADDRESS is not configured")
  }

  try {
    console.log("[v0] Minting POK NFT for:", userAddress, "with tokenURI:", tokenURI)

    // Create provider and signer
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

    // Create contract instance
    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_QUIZ_CONTRACT_ADDRESS, POK_CONTRACT_ABI, signer)

    // Call mintPOK function
    const tx = await contract.mintPOK(userAddress, tokenURI)
    console.log("[v0] Transaction sent:", tx.hash)

    // Wait for transaction confirmation
    const receipt = await tx.wait()
    console.log("[v0] Transaction confirmed:", receipt.hash)

    // Extract tokenId from Transfer event
    const transferEvent = receipt.logs.find((log: any) => {
      try {
        const parsed = contract.interface.parseLog(log)
        return parsed?.name === "Transfer"
      } catch {
        return false
      }
    })

    let tokenId = "0"
    if (transferEvent) {
      const parsed = contract.interface.parseLog(transferEvent)
      tokenId = parsed?.args[2]?.toString() || "0"
    }

    console.log("[v0] POK NFT minted successfully. TokenId:", tokenId)

    return {
      txHash: receipt.hash,
      tokenId: tokenId,
    }
  } catch (error) {
    console.error("[v0] Error minting POK NFT:", error)
    throw new Error(`Failed to mint POK NFT: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function getUserPOKs(userAddress: string): Promise<any[]> {
  if (!process.env.NEXT_PUBLIC_RPC_URL || !process.env.NEXT_PUBLIC_QUIZ_CONTRACT_ADDRESS) {
    return []
  }

  try {
    console.log("[v0] Fetching POKs for user:", userAddress)

    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_QUIZ_CONTRACT_ADDRESS, POK_CONTRACT_ABI, provider)

    const balance = await contract.balanceOf(userAddress)
    const poks = []

    for (let i = 0; i < balance; i++) {
      try {
        const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i)
        const tokenURI = await contract.tokenURI(tokenId)

        poks.push({
          tokenId: tokenId.toString(),
          tokenURI,
        })
      } catch (error) {
        console.error(`[v0] Error fetching POK ${i}:`, error)
      }
    }

    console.log("[v0] Found POKs:", poks.length)
    return poks
  } catch (error) {
    console.error("[v0] Error fetching user POKs:", error)
    return []
  }
}
