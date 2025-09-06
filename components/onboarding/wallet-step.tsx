"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, Shield, Info } from "lucide-react"
import type { OnboardingData } from "@/app/onboarding/page"

interface WalletStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onPrev: () => void
}

export function WalletStep({ data, updateData, onNext, onPrev }: WalletStepProps) {
  const [isConnecting, setIsConnecting] = useState(false)

  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      // Simulate wallet connection (in real app, use WalletConnect or similar)
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        })
        if (accounts.length > 0) {
          updateData({ walletAddress: accounts[0] })
        }
      } else {
        // Fallback for demo - generate a mock address
        const mockAddress = "0x" + Math.random().toString(16).substr(2, 40)
        updateData({ walletAddress: mockAddress })
      }
    } catch (error) {
      console.error("Wallet connection failed:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleNext = () => {
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto">
          <Wallet className="h-8 w-8 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Web3 Wallet</h3>
          <p className="text-gray-600">
            Connect your wallet to receive POK and POS NFTs when you complete assessments and projects.
          </p>
        </div>
      </div>

      {!data.walletAddress ? (
        <div className="space-y-4">
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="font-medium text-gray-900 mb-2">No Wallet Connected</h4>
              <p className="text-sm text-gray-600 mb-4">
                Connect your MetaMask or other Web3 wallet to start earning NFT credentials.
              </p>
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Or enter wallet address manually</Label>
            <Input
              placeholder="0x..."
              value={data.walletAddress}
              onChange={(e) => updateData({ walletAddress: e.target.value })}
            />
          </div>
        </div>
      ) : (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-green-900">Wallet Connected</h4>
                <p className="text-sm text-green-700 font-mono break-all">{data.walletAddress}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateData({ walletAddress: "" })}
                className="text-green-700 border-green-300 hover:bg-green-100"
              >
                Change
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Why connect a wallet?</p>
              <ul className="space-y-1 text-xs">
                <li>• Receive POK NFTs when you pass knowledge quizzes</li>
                <li>• Earn POS NFTs when you complete skill projects</li>
                <li>• Build a verifiable on-chain credential portfolio</li>
                <li>• Prove your skills to employers with blockchain verification</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {data.walletAddress ? "Continue" : "Skip for now"}
        </Button>
      </div>
    </div>
  )
}
