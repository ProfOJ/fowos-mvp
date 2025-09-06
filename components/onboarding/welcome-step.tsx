"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Trophy, Shield, Zap } from "lucide-react"
import type { OnboardingData } from "@/app/onboarding/page"

interface WelcomeStepProps {
  data: OnboardingData
  onComplete: () => void
  onPrev: () => void
}

export function WelcomeStep({ data, onComplete, onPrev }: WelcomeStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to FOWOS!</h3>
          <p className="text-gray-600">
            Your talent profile is ready. Here's what you can do next to start earning and getting noticed.
          </p>
        </div>
      </div>

      {/* Profile Summary */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Your Profile Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Experience Level</span>
              <Badge variant="secondary" className="capitalize">
                {data.experienceLevel}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Skills</span>
              <span className="text-sm font-medium">{data.skills.length} skills added</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Hourly Rate</span>
              <span className="text-sm font-medium">${data.hourlyRate}/hour</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Wallet</span>
              <span className="text-sm font-medium">{data.walletAddress ? "Connected" : "Not connected"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Recommended Next Steps</h4>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h5 className="font-medium text-gray-900">Take POK Quizzes</h5>
                <p className="text-sm text-gray-600">
                  Prove your knowledge in {data.skills.slice(0, 3).join(", ")} and earn NFT credentials.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Trophy className="h-5 w-5 text-indigo-600 mt-1" />
              <div>
                <h5 className="font-medium text-gray-900">Complete POS Projects</h5>
                <p className="text-sm text-gray-600">
                  Showcase your skills with real projects and build your portfolio.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Zap className="h-5 w-5 text-purple-600 mt-1" />
              <div>
                <h5 className="font-medium text-gray-900">Explore Marketplace</h5>
                <p className="text-sm text-gray-600">
                  Browse job opportunities and connect with employers looking for your skills.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button
          onClick={onComplete}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          Complete Setup
        </Button>
      </div>
    </div>
  )
}
