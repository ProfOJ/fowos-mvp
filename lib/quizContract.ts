// Smart contract integration for QuizStorage.sol
import { ethers } from "ethers"

const QUIZ_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_QUIZ_CONTRACT_ADDRESS || "0x..."

const QUIZ_CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "string", name: "quizId", type: "string" },
      { internalType: "string", name: "topic", type: "string" },
      { internalType: "uint256", name: "score", type: "uint256" },
    ],
    name: "recordAttempt",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "walletAddress", type: "address" }],
    name: "getAttempts",
    outputs: [
      {
        components: [
          { internalType: "string", name: "quizId", type: "string" },
          { internalType: "string", name: "topic", type: "string" },
          { internalType: "uint256", name: "score", type: "uint256" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
        ],
        internalType: "struct QuizStorage.QuizAttempt[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]

export class QuizContract {
  private contract: ethers.Contract | null = null
  private signer: ethers.Signer | null = null

  async initialize(provider: any) {
    const ethersProvider = new ethers.BrowserProvider(provider)
    this.signer = await ethersProvider.getSigner()
    this.contract = new ethers.Contract(QUIZ_CONTRACT_ADDRESS, QUIZ_CONTRACT_ABI, this.signer)
  }

  async recordAttempt(quizId: string, topic: string, score: number): Promise<string> {
    if (!this.contract) throw new Error("Contract not initialized")

    try {
      const tx = await this.contract.recordAttempt(quizId, topic, score)
      await tx.wait()
      return tx.hash
    } catch (error) {
      console.error("Error recording attempt on blockchain:", error)
      throw error
    }
  }

  async getAttempts(walletAddress: string): Promise<any[]> {
    if (!this.contract) throw new Error("Contract not initialized")

    try {
      const attempts = await this.contract.getAttempts(walletAddress)
      return attempts.map((attempt: any) => ({
        quizId: attempt.quizId,
        topic: attempt.topic,
        score: Number(attempt.score),
        timestamp: Number(attempt.timestamp),
      }))
    } catch (error) {
      console.error("Error fetching attempts from blockchain:", error)
      return []
    }
  }
}
