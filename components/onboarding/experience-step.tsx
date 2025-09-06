"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import type { OnboardingData } from "@/app/onboarding/page"

interface ExperienceStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onPrev: () => void
}

export function ExperienceStep({ data, updateData, onNext, onPrev }: ExperienceStepProps) {
  const handleNext = () => {
    if (data.experienceLevel && data.availability && data.hourlyRate > 0) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Experience Level *</Label>
          <Select
            value={data.experienceLevel}
            onValueChange={(value: "junior" | "mid" | "senior" | "expert") => updateData({ experienceLevel: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="junior">Junior (0-2 years)</SelectItem>
              <SelectItem value="mid">Mid-level (2-5 years)</SelectItem>
              <SelectItem value="senior">Senior (5-8 years)</SelectItem>
              <SelectItem value="expert">Expert (8+ years)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Availability *</Label>
          <Select
            value={data.availability}
            onValueChange={(value: "full-time" | "part-time" | "contract" | "freelance") =>
              updateData({ availability: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hourlyRate" className="text-sm font-medium text-gray-700">
          Hourly Rate (USD) *
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <Input
            id="hourlyRate"
            type="number"
            min="1"
            max="1000"
            placeholder="50"
            value={data.hourlyRate || ""}
            onChange={(e) => updateData({ hourlyRate: Number.parseInt(e.target.value) || 0 })}
            className="pl-8"
          />
        </div>
        <p className="text-xs text-gray-500">
          This helps employers understand your rate expectations. You can always adjust this later.
        </p>
      </div>

      {/* Experience Level Guide */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-medium text-blue-900 mb-2">Experience Level Guide</h3>
          <div className="space-y-1 text-sm text-blue-700">
            <p>
              <strong>Junior:</strong> Learning fundamentals, working on guided projects
            </p>
            <p>
              <strong>Mid-level:</strong> Independent work, some mentoring, complex features
            </p>
            <p>
              <strong>Senior:</strong> Architecture decisions, team leadership, system design
            </p>
            <p>
              <strong>Expert:</strong> Industry recognition, thought leadership, complex systems
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!data.experienceLevel || !data.availability || data.hourlyRate <= 0}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
