"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CompanyInfoStep } from "@/components/employer-onboarding/company-info-step"
import { CompanyDetailsStep } from "@/components/employer-onboarding/company-details-step"
import { HiringNeedsStep } from "@/components/employer-onboarding/hiring-needs-step"
import { VerificationStep } from "@/components/employer-onboarding/verification-step"
import { WelcomeStep } from "@/components/employer-onboarding/welcome-step"
import type { User } from "@supabase/supabase-js"

export interface EmployerOnboardingData {
  companyName: string
  companyDescription: string
  companySize: "1-10" | "11-50" | "51-200" | "201-1000" | "1000+"
  industry: string
  websiteUrl: string
  companyLogoUrl: string
  hiringNeeds: string[]
  budgetRange: string
  preferredSkills: string[]
  remotePolicy: string
}

const STEPS = [
  { id: 1, title: "Company Info", description: "Tell us about your company" },
  { id: 2, title: "Company Details", description: "Size, industry, and website" },
  { id: 3, title: "Hiring Needs", description: "What talent are you looking for?" },
  { id: 4, title: "Verification", description: "Verify your company" },
  { id: 5, title: "Welcome", description: "You're all set!" },
]

export default function EmployerOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [onboardingData, setOnboardingData] = useState<EmployerOnboardingData>({
    companyName: "",
    companyDescription: "",
    companySize: "1-10",
    industry: "",
    websiteUrl: "",
    companyLogoUrl: "",
    hiringNeeds: [],
    budgetRange: "",
    preferredSkills: [],
    remotePolicy: "hybrid",
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

      // Check if user already has a profile
      const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

      if (profile?.user_type === "talent") {
        router.push("/onboarding")
        return
      }

      // Check if employer profile already exists
      const { data: employer } = await supabase.from("employers").select("id").eq("id", user.id).single()

      if (employer) {
        router.push("/employer-dashboard")
        return
      }

      setUser(user)
      setIsLoading(false)
    }

    checkUser()
  }, [supabase, router])

  const updateOnboardingData = (data: Partial<EmployerOnboardingData>) => {
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
      // Update profile to employer type
      await supabase.from("profiles").update({ user_type: "employer" }).eq("id", user.id)

      // Create employer profile
      const { error } = await supabase.from("employers").insert({
        id: user.id,
        company_name: onboardingData.companyName,
        company_description: onboardingData.companyDescription,
        company_size: onboardingData.companySize,
        industry: onboardingData.industry,
        website_url: onboardingData.websiteUrl || null,
        company_logo_url: onboardingData.companyLogoUrl || null,
        verified: false, // Will be verified later
      })

      if (error) throw error

      router.push("/employer-dashboard")
    } catch (error) {
      console.error("Error completing onboarding:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    )
  }

  const progress = (currentStep / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FOWOS</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Employer Profile</h1>
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
                className={`${step.id <= currentStep ? "text-purple-600 font-medium" : "text-gray-400"}`}
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
              <CompanyInfoStep data={onboardingData} updateData={updateOnboardingData} onNext={nextStep} />
            )}
            {currentStep === 2 && (
              <CompanyDetailsStep
                data={onboardingData}
                updateData={updateOnboardingData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {currentStep === 3 && (
              <HiringNeedsStep
                data={onboardingData}
                updateData={updateOnboardingData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {currentStep === 4 && (
              <VerificationStep
                data={onboardingData}
                updateData={updateOnboardingData}
                onNext={nextStep}
                onPrev={prevStep}
              />
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
