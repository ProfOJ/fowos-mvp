"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { X, Plus } from "lucide-react"
import type { EmployerOnboardingData } from "@/app/employer-onboarding/page"

interface HiringNeedsStepProps {
  data: EmployerOnboardingData
  updateData: (data: Partial<EmployerOnboardingData>) => void
  onNext: () => void
  onPrev: () => void
}

const HIRING_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile Developer",
  "DevOps Engineer",
  "UI/UX Designer",
  "Product Manager",
  "Data Scientist",
  "Blockchain Developer",
  "Smart Contract Developer",
  "QA Engineer",
  "Technical Writer",
]

const POPULAR_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "Solidity",
  "Web3",
  "DeFi",
  "Smart Contracts",
  "Blockchain",
  "Ethereum",
  "Next.js",
  "Vue.js",
  "Angular",
  "Go",
  "Rust",
  "Java",
  "C++",
  "Docker",
  "Kubernetes",
  "AWS",
  "GraphQL",
  "PostgreSQL",
  "MongoDB",
]

export function HiringNeedsStep({ data, updateData, onNext, onPrev }: HiringNeedsStepProps) {
  const [newSkill, setNewSkill] = useState("")

  const addHiringNeed = (role: string) => {
    if (!data.hiringNeeds.includes(role)) {
      updateData({ hiringNeeds: [...data.hiringNeeds, role] })
    }
  }

  const removeHiringNeed = (roleToRemove: string) => {
    updateData({ hiringNeeds: data.hiringNeeds.filter((role) => role !== roleToRemove) })
  }

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim()
    if (trimmedSkill && !data.preferredSkills.includes(trimmedSkill)) {
      updateData({ preferredSkills: [...data.preferredSkills, trimmedSkill] })
    }
    setNewSkill("")
  }

  const removeSkill = (skillToRemove: string) => {
    updateData({ preferredSkills: data.preferredSkills.filter((skill) => skill !== skillToRemove) })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill(newSkill)
    }
  }

  const handleNext = () => {
    if (data.hiringNeeds.length > 0) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      {/* Hiring Roles */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            What roles are you looking to hire? * (select at least 1)
          </Label>
        </div>

        {/* Current Hiring Needs */}
        {data.hiringNeeds.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Selected Roles ({data.hiringNeeds.length})
            </Label>
            <div className="flex flex-wrap gap-2">
              {data.hiringNeeds.map((role) => (
                <Badge
                  key={role}
                  variant="secondary"
                  className="bg-purple-100 text-purple-700 hover:bg-purple-200 pr-1"
                >
                  {role}
                  <button
                    onClick={() => removeHiringNeed(role)}
                    className="ml-2 hover:bg-purple-300 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Available Roles */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Available Roles</Label>
          <div className="flex flex-wrap gap-2">
            {HIRING_ROLES.filter((role) => !data.hiringNeeds.includes(role)).map((role) => (
              <Badge
                key={role}
                variant="outline"
                className="cursor-pointer hover:bg-gray-100 text-gray-600"
                onClick={() => addHiringNeed(role)}
              >
                + {role}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Budget Range */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Budget Range (Optional)</Label>
        <Select value={data.budgetRange} onValueChange={(value) => updateData({ budgetRange: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select budget range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="$25-50/hr">$25-50/hour</SelectItem>
            <SelectItem value="$50-75/hr">$50-75/hour</SelectItem>
            <SelectItem value="$75-100/hr">$75-100/hour</SelectItem>
            <SelectItem value="$100-150/hr">$100-150/hour</SelectItem>
            <SelectItem value="$150+/hr">$150+/hour</SelectItem>
            <SelectItem value="project-based">Project-based</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Preferred Skills */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Preferred Skills (Optional)</Label>
          <p className="text-sm text-gray-600 mb-4">
            Add specific skills you're looking for to help match with the right talent.
          </p>
        </div>

        {/* Current Skills */}
        {data.preferredSkills.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {data.preferredSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 pr-1">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="ml-2 hover:bg-blue-300 rounded-full p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Add New Skill */}
        <div className="flex gap-2">
          <Input
            placeholder="Add a skill (e.g., React, Python, Blockchain)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => addSkill(newSkill)}
            disabled={!newSkill.trim()}
            className="px-3"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Popular Skills */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Popular Skills</Label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SKILLS.filter((skill) => !data.preferredSkills.includes(skill))
              .slice(0, 12)
              .map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100 text-gray-600"
                  onClick={() => addSkill(skill)}
                >
                  + {skill}
                </Badge>
              ))}
          </div>
        </div>
      </div>

      {data.hiringNeeds.length === 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <p className="text-sm text-amber-700">Please select at least one role you're looking to hire.</p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={data.hiringNeeds.length === 0}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
