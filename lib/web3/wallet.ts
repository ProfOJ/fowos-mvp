import { Web3Auth } from "@web3auth/modal"
import { CHAIN_NAMESPACES, type IProvider, WEB3AUTH_NETWORK } from "@web3auth/base"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x89", // Polygon Mainnet
  rpcTarget: process.env.NEXT_PUBLIC_RPC_URL!,
  displayName: "Polygon Mainnet",
  blockExplorer: "https://polygonscan.com",
  ticker: "MATIC",
  tickerName: "Polygon",
}

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
})

const web3auth = new Web3Auth({
  clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
})

export interface WalletInfo {
  address: string
  ensName?: string
  provider: IProvider
}

export class WalletManager {
  private static instance: WalletManager
  private provider: IProvider | null = null
  private walletAddress: string | null = null

  static getInstance(): WalletManager {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager()
    }
    return WalletManager.instance
  }

  async initialize(): Promise<void> {
    await web3auth.initModal()
  }

  async connect(): Promise<WalletInfo> {
    const provider = await web3auth.connect()
    if (!provider) throw new Error("Failed to connect wallet")

    this.provider = provider

    // Get wallet address
    const accounts = await provider.request({ method: "eth_accounts" })
    this.walletAddress = accounts[0] as string

    // Generate ENS subdomain
    const ensName = await this.generateENSName()

    return {
      address: this.walletAddress,
      ensName,
      provider,
    }
  }

  async disconnect(): Promise<void> {
    await web3auth.logout()
    this.provider = null
    this.walletAddress = null
  }

  private async generateENSName(): Promise<string> {
    // Generate unique ENS subdomain based on wallet address
    const shortAddress = this.walletAddress?.slice(2, 8) || "user"
    return `${shortAddress}.fowos.eth`
  }

  async mintPOK(quizId: string, score: number): Promise<string> {
    if (!this.provider) throw new Error("Wallet not connected")

    // Call smart contract to mint POK token
    // This would interact with the deployed POK contract
    const response = await fetch("/api/mintPOK", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId, score, walletAddress: this.walletAddress }),
    })

    const result = await response.json()
    return result.tokenId
  }

  async mintPOS(projectId: string, skills: string[]): Promise<string> {
    if (!this.provider) throw new Error("Wallet not connected")

    // Call smart contract to mint POS token
    const response = await fetch("/api/mintPOS", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, skills, walletAddress: this.walletAddress }),
    })

    const result = await response.json()
    return result.tokenId
  }
}
