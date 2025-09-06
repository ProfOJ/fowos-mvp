"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { EmployerOnboardingData } from "@/app/employer-onboarding/page"

interface CompanyDetailsStepProps {
  data: EmployerOnboardingData
  updateData: (data: Partial<EmployerOnboardingData>) => void
  onNext: () => void
  onPrev: () => void
}

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "E-commerce",
  "Education",
  "Gaming",
  "Blockchain/Web3",
  "SaaS",
  "Fintech",
  "Biotech",
  "Media & Entertainment",
  "Real Estate",
  "Manufacturing",
  "Consulting",
  "Other",
]

export function CompanyDetailsStep({ data, updateData, onNext, onPrev }: CompanyDetailsStepProps) {
  const handleNext = () => {
    if (data.companySize && data.industry) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Company Size *</Label>
          <Select
            value={data.companySize}
            onValueChange={(value: "1-10" | "11-50" | "51-200" | "201-1000" | "1000+") =>
              updateData({ companySize: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10 employees</SelectItem>
              <SelectItem value="11-50">11-50 employees</SelectItem>
              <SelectItem value="51-200">51-200 employees</SelectItem>
              <SelectItem value="201-1000">201-1000 employees</SelectItem>
              <SelectItem value="1000+">1000+ employees</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Industry *</Label>
          <Select value={data.industry} onValueChange={(value) => updateData({ industry: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="websiteUrl" className="text-sm font-medium text-gray-700">
          Company Website
        </Label>
        <Input
          id="websiteUrl"
          type="url"
          placeholder="https://yourcompany.com"
          value={data.websiteUrl}
          onChange={(e) => updateData({ websiteUrl: e.target.value })}
        />
        <p className="text-xs text-gray-500">
          Adding your website helps talent learn more about your company and increases trust.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyLogoUrl" className="text-sm font-medium text-gray-700">
          Company Logo URL
        </Label>
        <Input
          id="companyLogoUrl"
          type="url"
          placeholder="https://yourcompany.com/logo.png"
          value={data.companyLogoUrl}
          onChange={(e) => updateData({ companyLogoUrl: e.target.value })}
        />
        <p className="text-xs text-gray-500">Optional: Add your company logo to make your profile stand out.</p>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!data.companySize || !data.industry}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
