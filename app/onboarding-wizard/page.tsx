"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  CheckCircle,
  User,
  Wallet,
  Trophy,
  Award,
  Building,
  Sparkles,
  ArrowRight,
  Copy,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import confetti from "canvas-confetti"

export default function OnboardingWizardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [talent, setTalent] = useState<any>(null)
  const [employer, setEmployer] = useState<any>(null)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState("profile")
  const [ensAddress, setEnsAddress] = useState("")
  const [loading, setLoading] = useState(true)
  const [talentData, setTalentData] = useState<any>(null) // Declare talentData
  const [employerData, setEmployerData] = useState<any>(null) // Declare employerData

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUserAndProgress()
  }, [])

  const checkUserAndProgress = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)

      // Get profile data
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      setProfile(profileData)

      // Check if talent or employer profile exists
      if (profileData?.user_type === "talent") {
        const { data: talentData } = await supabase.from("talents").select("*").eq("user_id", user.id).single()
        setTalent(talentData)
        setTalentData(talentData) // Set talentData
      } else if (profileData?.user_type === "employer") {
        const { data: employerData } = await supabase.from("employers").select("*").eq("user_id", user.id).single()
        setEmployer(employerData)
        setEmployerData(employerData) // Set employerData
      }

      // Generate ENS address (mock for demo)
      const mockEns = `${profileData?.full_name?.toLowerCase().replace(/\s+/g, "") || "user"}.fowos.eth`
      setEnsAddress(mockEns)

      // Determine completed steps
      const completed = []
      if (profileData?.full_name) completed.push("profile")
      if (profileData?.user_type === "talent" && talentData) completed.push("talent-profile")
      if (profileData?.user_type === "employer" && employerData) completed.push("company-profile")

      setCompletedSteps(completed)

      // Set current step to first incomplete
      if (!profileData?.full_name) {
        setCurrentStep("profile")
      } else if (profileData?.user_type === "talent" && !talentData) {
        setCurrentStep("talent-profile")
      } else if (profileData?.user_type === "employer" && !employerData) {
        setCurrentStep("company-profile")
      } else {
        setCurrentStep("ens")
      }
    } catch (error) {
      console.error("Error checking user progress:", error)
    } finally {
      setLoading(false)
    }
  }

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  const copyEnsAddress = () => {
    navigator.clipboard.writeText(ensAddress)
    triggerCelebration()
  }

  const isStepCompleted = (step: string) => completedSteps.includes(step)
  const isStepCurrent = (step: string) => currentStep === step

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your onboarding...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-16">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Welcome to FOWOS!</h1>
          </div>
          <p className="text-lg text-gray-600">
            Let's get you set up with your Web3 talent profile in just a few steps
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">Progress:</div>
                <div className="flex space-x-2">
                  {["profile", "talent-profile", "company-profile", "ens", "pok", "pos"].map((step) => {
                    const shouldShow = step !== "talent-profile" || profile?.user_type === "talent"
                    const shouldShowCompany = step !== "company-profile" || profile?.user_type === "employer"

                    if (!shouldShow && step === "talent-profile") return null
                    if (!shouldShowCompany && step === "company-profile") return null

                    return (
                      <div
                        key={step}
                        className={`w-3 h-3 rounded-full ${
                          isStepCompleted(step) ? "bg-green-500" : isStepCurrent(step) ? "bg-blue-500" : "bg-gray-300"
                        }`}
                      />
                    )
                  })}
                </div>
              </div>
              <Badge variant="secondary">
                {completedSteps.length} /{" "}
                {profile?.user_type === "talent" ? 5 : profile?.user_type === "employer" ? 4 : 3} Complete
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Onboarding Steps */}
        <Accordion type="single" value={currentStep} className="space-y-4">
          {/* Step 1: Complete Profile */}
          <AccordionItem value="profile" className="border rounded-lg">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center space-x-3">
                {isStepCompleted("profile") ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <User className="h-5 w-5 text-blue-500" />
                )}
                <span className="font-medium">Complete Your Profile</span>
                {isStepCompleted("profile") && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Complete
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              {isStepCompleted("profile") ? (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Profile completed!</span>
                  </div>
                  <p className="text-green-600 mt-1">Welcome, {profile?.full_name}! Your basic profile is set up.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600">Complete your basic profile information to get started on FOWOS.</p>
                  <Link href="/onboarding">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <User className="h-4 w-4 mr-2" />
                      Complete Profile
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Step 2: ENS Address */}
          <AccordionItem value="ens" className="border rounded-lg">
            <AccordionTrigger className="px-6 hover:no-underline">
              <div className="flex items-center space-x-3">
                <Wallet className="h-5 w-5 text-purple-500" />
                <span className="font-medium">Your ENS Address</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  Ready
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                <div className="text-center">
                  <Wallet className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">🎉 Your ENS Address is Ready!</h3>
                  <p className="text-gray-600 mb-4">Your unique Web3 identity on FOWOS</p>
                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-purple-300 mb-4">
                    <div className="flex items-center justify-center space-x-2">
                      <code className="text-lg font-mono text-purple-600">{ensAddress}</code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copyEnsAddress}
                        className="border-purple-300 text-purple-600 hover:bg-purple-50 bg-transparent"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    This address will be used for all your Web3 credentials and NFTs
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Step 3: Talent Profile (only for talents) */}
          {profile?.user_type === "talent" && (
            <AccordionItem value="talent-profile" className="border rounded-lg">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center space-x-3">
                  {isStepCompleted("talent-profile") ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <User className="h-5 w-5 text-blue-500" />
                  )}
                  <span className="font-medium">Complete Talent Profile</span>
                  {isStepCompleted("talent-profile") && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Complete
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                {isStepCompleted("talent-profile") ? (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Talent profile completed!</span>
                    </div>
                    <p className="text-green-600 mt-1">Your skills and experience are now showcased.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Set up your talent profile with skills, experience, and preferences.
                    </p>
                    <Link href="/onboarding">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <User className="h-4 w-4 mr-2" />
                        Complete Talent Profile
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Step 3: Company Profile (only for employers) */}
          {profile?.user_type === "employer" && (
            <AccordionItem value="company-profile" className="border rounded-lg">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center space-x-3">
                  {isStepCompleted("company-profile") ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Building className="h-5 w-5 text-purple-500" />
                  )}
                  <span className="font-medium">Complete Company Profile</span>
                  {isStepCompleted("company-profile") && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Complete
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                {isStepCompleted("company-profile") ? (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Company profile completed!</span>
                    </div>
                    <p className="text-green-600 mt-1">Your company is ready to hire verified talent.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-600">Set up your company profile to start hiring verified talent.</p>
                    <Link href="/employer-onboarding">
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Building className="h-4 w-4 mr-2" />
                        Complete Company Profile
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Step 4: Mint POK (only for talents) */}
          {profile?.user_type === "talent" && (
            <AccordionItem value="pok" className="border rounded-lg">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center space-x-3">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">Mint Your First POK</span>
                  <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                    Optional
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Take a quiz to prove your knowledge and mint your first POK NFT credential.
                  </p>
                  <div className="flex space-x-3">
                    <Link href="/quizzes">
                      <Button className="bg-yellow-600 hover:bg-yellow-700">
                        <Trophy className="h-4 w-4 mr-2" />
                        Browse Quizzes
                      </Button>
                    </Link>
                    <Link href="/quizzes/generate">
                      <Button variant="outline">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Quiz
                      </Button>
                    </Link>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Step 5: Mint POS (only for talents) */}
          {profile?.user_type === "talent" && (
            <AccordionItem value="pos" className="border rounded-lg">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-indigo-500" />
                  <span className="font-medium">Mint Your First POS</span>
                  <Badge variant="outline" className="border-indigo-300 text-indigo-700">
                    Optional
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Submit a project to prove your skills and mint your first POS NFT credential.
                  </p>
                  <Link href="/projects/submit">
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      <Award className="h-4 w-4 mr-2" />
                      Submit Project
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

        {/* Action Buttons */}
        <div className="mt-8 text-center space-y-4">
          <div className="flex justify-center space-x-4">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button size="lg" variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Explore Marketplace
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            You can always return to complete these steps later from your dashboard
          </p>
        </div>
      </div>
    </div>
  )
}
