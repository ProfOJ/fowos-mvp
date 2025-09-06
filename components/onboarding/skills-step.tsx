"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import type { OnboardingData } from "@/app/onboarding/page"

interface SkillsStepProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onPrev: () => void
}

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

export function SkillsStep({ data, updateData, onNext, onPrev }: SkillsStepProps) {
  const [newSkill, setNewSkill] = useState("")

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim()
    if (trimmedSkill && !data.skills.includes(trimmedSkill)) {
      updateData({ skills: [...data.skills, trimmedSkill] })
    }
    setNewSkill("")
  }

  const removeSkill = (skillToRemove: string) => {
    updateData({ skills: data.skills.filter((skill) => skill !== skillToRemove) })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill(newSkill)
    }
  }

  const handleNext = () => {
    if (data.skills.length >= 3) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Your Skills * (minimum 3)</Label>
          <p className="text-sm text-gray-600 mb-4">
            Add your technical skills, programming languages, frameworks, and areas of expertise.
          </p>
        </div>

        {/* Current Skills */}
        {data.skills.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Your Skills ({data.skills.length})
            </Label>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
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
            {POPULAR_SKILLS.filter((skill) => !data.skills.includes(skill))
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

        {data.skills.length < 3 && (
          <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
            Please add at least 3 skills to continue. This helps employers find you more easily.
          </p>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={data.skills.length < 3}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
