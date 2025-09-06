"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import type { EmployerOnboardingData } from "@/app/employer-onboarding/page"

interface VerificationStepProps {
  data: EmployerOnboardingData
  updateData: (data: Partial<EmployerOnboardingData>) => void
  onNext: () => void
  onPrev: () => void
}

export function VerificationStep({ data, updateData, onNext, onPrev }: VerificationStepProps) {
  const hasWebsite = data.websiteUrl.trim().length > 0
  const hasCompanyInfo = data.companyName.trim().length > 0 && data.companyDescription.trim().length > 0

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Company Verification</h3>
          <p className="text-gray-600">
            We'll review your company information to ensure a trusted hiring environment for talent.
          </p>
        </div>
      </div>

      {/* Verification Checklist */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Verification Checklist</h4>

        <Card className={`border-2 ${hasCompanyInfo ? "border-green-200 bg-green-50" : "border-gray-200"}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              {hasCompanyInfo ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Clock className="h-5 w-5 text-gray-400" />
              )}
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">Company Information</h5>
                <p className="text-sm text-gray-600">Complete company name and description provided</p>
              </div>
              <Badge variant={hasCompanyInfo ? "default" : "secondary"} className="bg-green-100 text-green-700">
                {hasCompanyInfo ? "Complete" : "Pending"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-2 ${hasWebsite ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              {hasWebsite ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              )}
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">Website Verification</h5>
                <p className="text-sm text-gray-600">
                  {hasWebsite ? "Company website provided for verification" : "No website provided (optional)"}
                </p>
              </div>
              <Badge
                variant={hasWebsite ? "default" : "secondary"}
                className={hasWebsite ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
              >
                {hasWebsite ? "Provided" : "Optional"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">Manual Review</h5>
                <p className="text-sm text-gray-600">Our team will review your company within 24-48 hours</p>
              </div>
              <Badge className="bg-blue-100 text-blue-700">Pending</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Benefits */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <h4 className="font-medium text-purple-900 mb-3">Benefits of Verification</h4>
          <ul className="space-y-2 text-sm text-purple-700">
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-purple-600" />
              <span>Verified badge on your company profile</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-purple-600" />
              <span>Higher visibility in talent search results</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-purple-600" />
              <span>Increased trust from potential hires</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-purple-600" />
              <span>Access to premium talent matching features</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
        <ol className="text-sm text-gray-600 space-y-1">
          <li>1. Complete your employer profile setup</li>
          <li>2. Our team reviews your company information</li>
          <li>3. You'll receive verification status via email</li>
          <li>4. Start posting jobs and connecting with verified talent</li>
        </ol>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button
          onClick={onNext}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
