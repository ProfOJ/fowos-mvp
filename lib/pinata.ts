export interface POKMetadata {
  userAddress: string
  quizId: string
  score: number
  timestamp: string
  title: string
  description: string
  category: string
  difficulty: string
}

export async function uploadPOKMetadataToPinata(metadata: POKMetadata): Promise<string> {
  if (!process.env.PINATA_JWT) {
    throw new Error("PINATA_JWT is not configured")
  }

  try {
    console.log("[v0] Uploading POK metadata to Pinata:", metadata)

    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: JSON.stringify({
        pinataContent: {
          name: `POK NFT - ${metadata.title}`,
          description: metadata.description,
          image: "https://fowos.vercel.app/pok-badge.png", // Default POK badge image
          attributes: [
            {
              trait_type: "Quiz Title",
              value: metadata.title,
            },
            {
              trait_type: "Category",
              value: metadata.category,
            },
            {
              trait_type: "Difficulty",
              value: metadata.difficulty,
            },
            {
              trait_type: "Score",
              value: metadata.score,
            },
            {
              trait_type: "Date Earned",
              value: metadata.timestamp,
            },
          ],
          external_url: `https://fowos.vercel.app/profile/${metadata.userAddress}`,
        },
        pinataMetadata: {
          name: `POK-${metadata.quizId}-${metadata.userAddress}`,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Pinata upload failed:", errorText)
      throw new Error(`Pinata upload failed: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    const tokenURI = `ipfs://${result.IpfsHash}`

    console.log("[v0] Successfully uploaded to Pinata:", tokenURI)
    return tokenURI
  } catch (error) {
    console.error("[v0] Error uploading to Pinata:", error)
    throw new Error(`Failed to upload metadata to Pinata: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function fetchPOKMetadataFromIPFS(tokenURI: string): Promise<any> {
  try {
    const ipfsHash = tokenURI.replace("ipfs://", "")
    const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs/"
    const url = `${gateway}${ipfsHash}`

    console.log("[v0] Fetching POK metadata from IPFS:", url)

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] Error fetching from IPFS:", error)
    throw error
  }
}
