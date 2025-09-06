import { Web3Auth } from "@web3auth/modal"
import { CHAIN_NAMESPACES, type IProvider, WEB3AUTH_NETWORK } from "@web3auth/base"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"
import { createClient } from "@/lib/supabase/client"

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7", // Sepolia Testnet
  rpcTarget: process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.sepolia.org",
  displayName: "Sepolia Testnet",
  blockExplorer: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
}

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
})

const web3auth = new Web3Auth({
  clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
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
  private supabase = createClient()

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

    // Save wallet to Supabase if new
    await this.saveWalletToSupabase()

    // Generate ENS subdomain
    const ensName = await this.generateENSName()

    return {
      address: this.walletAddress,
      ensName,
      provider,
    }
  }

  async connectExistingWallet(): Promise<string | null> {
    // Check if wallet exists in Supabase and login user
    if (!this.walletAddress) return null

    const { data: wallet } = await this.supabase
      .from("user_wallets")
      .select("user_id")
      .eq("wallet_address", this.walletAddress)
      .single()

    return wallet?.user_id || null
  }

  private async saveWalletToSupabase(): Promise<void> {
    if (!this.walletAddress) return

    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    if (!user) return

    // Check if wallet already exists
    const { data: existing } = await this.supabase.from("user_wallets").select("id").eq("user_id", user.id).single()

    if (!existing) {
      await this.supabase.from("user_wallets").insert({
        user_id: user.id,
        wallet_address: this.walletAddress,
      })
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

  getWalletAddress(): string | null {
    return this.walletAddress
  }

  getProvider(): IProvider | null {
    return this.provider
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
