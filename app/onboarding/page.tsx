"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PersonalInfoStep } from "@/components/onboarding/personal-info-step"
import { SkillsStep } from "@/components/onboarding/skills-step"
import { ExperienceStep } from "@/components/onboarding/experience-step"
import { WalletStep } from "@/components/onboarding/wallet-step"
import { WelcomeStep } from "@/components/onboarding/welcome-step"
import type { User } from "@supabase/supabase-js"

export interface OnboardingData {
  bio: string
  skills: string[]
  experienceLevel: "junior" | "mid" | "senior" | "expert"
  hourlyRate: number
  availability: "full-time" | "part-time" | "contract" | "freelance"
  location: string
  portfolioUrl: string
  githubUrl: string
  linkedinUrl: string
  walletAddress: string
}

const STEPS = [
  { id: 1, title: "Personal Info", description: "Tell us about yourself" },
  { id: 2, title: "Skills", description: "What are your expertise areas?" },
  { id: 3, title: "Experience", description: "Your professional background" },
  { id: 4, title: "Wallet", description: "Connect your Web3 wallet" },
  { id: 5, title: "Welcome", description: "You're all set!" },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    bio: "",
    skills: [],
    experienceLevel: "junior",
    hourlyRate: 50,
    availability: "full-time",
    location: "",
    portfolioUrl: "",
    githubUrl: "",
    linkedinUrl: "",
    walletAddress: "",
  })

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      // Check if user already has a talent profile
      const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

      if (profile?.user_type === "employer") {
        router.push("/employer-onboarding")
        return
      }

      // Check if talent profile already exists
      const { data: talent } = await supabase.from("talents").select("id").eq("id", user.id).single()

      if (talent) {
        router.push("/dashboard")
        return
      }

      setUser(user)
      setIsLoading(false)
    }

    checkUser()
  }, [supabase, router])

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeOnboarding = async () => {
    if (!user) return

    try {
      // Update profile to talent type
      await supabase.from("profiles").update({ user_type: "talent" }).eq("id", user.id)

      // Create talent profile
      const { error } = await supabase.from("talents").insert({
        id: user.id,
        bio: onboardingData.bio,
        skills: onboardingData.skills,
        experience_level: onboardingData.experienceLevel,
        hourly_rate: onboardingData.hourlyRate,
        availability: onboardingData.availability,
        location: onboardingData.location,
        portfolio_url: onboardingData.portfolioUrl || null,
        github_url: onboardingData.githubUrl || null,
        linkedin_url: onboardingData.linkedinUrl || null,
      })

      if (error) throw error

      // Update wallet address in profiles if provided
      if (onboardingData.walletAddress) {
        await supabase.from("profiles").update({ wallet_address: onboardingData.walletAddress }).eq("id", user.id)
      }

      router.push("/dashboard")
    } catch (error) {
      console.error("Error completing onboarding:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  const progress = (currentStep / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FOWOS</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Talent Profile</h1>
          <p className="text-gray-600">
            Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {STEPS.map((step) => (
              <span
                key={step.id}
                className={`${step.id <= currentStep ? "text-blue-600 font-medium" : "text-gray-400"}`}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">{STEPS[currentStep - 1].title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <PersonalInfoStep data={onboardingData} updateData={updateOnboardingData} onNext={nextStep} />
            )}
            {currentStep === 2 && (
              <SkillsStep data={onboardingData} updateData={updateOnboardingData} onNext={nextStep} onPrev={prevStep} />
            )}
            {currentStep === 3 && (
              <ExperienceStep
                data={onboardingData}
                updateData={updateOnboardingData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {currentStep === 4 && (
              <WalletStep data={onboardingData} updateData={updateOnboardingData} onNext={nextStep} onPrev={prevStep} />
            )}
            {currentStep === 5 && (
              <WelcomeStep data={onboardingData} onComplete={completeOnboarding} onPrev={prevStep} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
