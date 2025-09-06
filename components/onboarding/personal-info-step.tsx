"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { OnboardingData } from "@/app/onboarding/page"

interface PersonalInfoStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
}

export function PersonalInfoStep({ data, updateData, onNext }: PersonalInfoStepProps) {
  const handleNext = () => {
    if (data.bio.trim() && data.location.trim()) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
          Bio *
        </Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself, your background, and what makes you unique as a talent..."
          value={data.bio}
          onChange={(e) => updateData({ bio: e.target.value })}
          className="min-h-[120px] resize-none"
          maxLength={500}
        />
        <p className="text-xs text-gray-500">{data.bio.length}/500 characters</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-medium text-gray-700">
          Location *
        </Label>
        <Input
          id="location"
          placeholder="e.g., San Francisco, CA or Remote"
          value={data.location}
          onChange={(e) => updateData({ location: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="portfolio" className="text-sm font-medium text-gray-700">
            Portfolio URL
          </Label>
          <Input
            id="portfolio"
            type="url"
            placeholder="https://yourportfolio.com"
            value={data.portfolioUrl}
            onChange={(e) => updateData({ portfolioUrl: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="github" className="text-sm font-medium text-gray-700">
            GitHub URL
          </Label>
          <Input
            id="github"
            type="url"
            placeholder="https://github.com/yourusername"
            value={data.githubUrl}
            onChange={(e) => updateData({ githubUrl: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin" className="text-sm font-medium text-gray-700">
          LinkedIn URL
        </Label>
        <Input
          id="linkedin"
          type="url"
          placeholder="https://linkedin.com/in/yourprofile"
          value={data.linkedinUrl}
          onChange={(e) => updateData({ linkedinUrl: e.target.value })}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleNext}
          disabled={!data.bio.trim() || !data.location.trim()}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
