"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, Briefcase, Zap } from "lucide-react"
import type { EmployerOnboardingData } from "@/app/employer-onboarding/page"

interface WelcomeStepProps {
  data: EmployerOnboardingData
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
            Your employer profile is ready. Start connecting with verified talent and build your dream team.
          </p>
        </div>
      </div>

      {/* Company Summary */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Your Company Profile</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Company</span>
              <span className="text-sm font-medium">{data.companyName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Industry</span>
              <Badge variant="secondary">{data.industry}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Company Size</span>
              <span className="text-sm font-medium">{data.companySize} employees</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Hiring Roles</span>
              <span className="text-sm font-medium">{data.hiringNeeds.length} roles</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Website</span>
              <span className="text-sm font-medium">{data.websiteUrl ? "Provided" : "Not provided"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">What you can do next</h4>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Briefcase className="h-5 w-5 text-purple-600 mt-1" />
              <div>
                <h5 className="font-medium text-gray-900">Post Your First Job</h5>
                <p className="text-sm text-gray-600">
                  Create job postings and start attracting verified talent with POK/POS credentials.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Users className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h5 className="font-medium text-gray-900">Browse Talent Marketplace</h5>
                <p className="text-sm text-gray-600">
                  Discover verified developers, designers, and specialists with blockchain-proven skills.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Zap className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <h5 className="font-medium text-gray-900">Get Verified</h5>
                <p className="text-sm text-gray-600">
                  Complete company verification to unlock premium features and increase trust.
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
