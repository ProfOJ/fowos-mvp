"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { EmployerOnboardingData } from "@/app/employer-onboarding/page"

interface CompanyInfoStepProps {
  data: EmployerOnboardingData
  updateData: (data: Partial<EmployerOnboardingData>) => void
  onNext: () => void
}

export function CompanyInfoStep({ data, updateData, onNext }: CompanyInfoStepProps) {
  const handleNext = () => {
    if (data.companyName.trim() && data.companyDescription.trim()) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
          Company Name *
        </Label>
        <Input
          id="companyName"
          placeholder="e.g., Acme Corporation"
          value={data.companyName}
          onChange={(e) => updateData({ companyName: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyDescription" className="text-sm font-medium text-gray-700">
          Company Description *
        </Label>
        <Textarea
          id="companyDescription"
          placeholder="Describe your company, mission, and what makes you unique as an employer..."
          value={data.companyDescription}
          onChange={(e) => updateData({ companyDescription: e.target.value })}
          className="min-h-[120px] resize-none"
          maxLength={500}
        />
        <p className="text-xs text-gray-500">{data.companyDescription.length}/500 characters</p>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="font-medium text-purple-900 mb-2">Why join FOWOS as an employer?</h3>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Access to verified talent with blockchain-proven skills</li>
          <li>• Hire based on actual POK/POS credentials, not just resumes</li>
          <li>• Connect with pre-screened developers, designers, and specialists</li>
          <li>• Transparent skill verification through NFT portfolios</li>
        </ul>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleNext}
          disabled={!data.companyName.trim() || !data.companyDescription.trim()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
