"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Trophy, Award, Star, Briefcase, Clock, DollarSign, Send, CheckCircle } from "lucide-react"
import Link from "next/link"

interface TalentProfile {
  id: string
  full_name: string
  avatar_url: string
  bio: string
  skills: string[]
  experience_level: string
  hourly_rate: number
  location: string
  country: string
  pok_score: number
  pos_score: number
  reputation_score: number
  total_reviews: number
  availability: string
  ens_address: string
}

interface HireFormData {
  selectedSkills: string[]
  engagementType: string
  hoursPerWeek: number
  ratePerHour: number
  message: string
  projectTitle: string
  projectDescription: string
}

export default function HireTalentPage({ params }: { params: { id: string } }) {
  const [talent, setTalent] = useState<TalentProfile | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<HireFormData>({
    selectedSkills: [],
    engagementType: "",
    hoursPerWeek: 40,
    ratePerHour: 0,
    message: "",
    projectTitle: "",
    projectDescription: "",
  })

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUserAndFetchTalent()
  }, [params.id])

  const checkUserAndFetchTalent = async () => {
    try {
      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)

      // Fetch talent profile
      const { data: talentData, error } = await supabase
        .from("talents")
        .select(`
          *,
          profiles!inner(full_name, avatar_url)
        `)
        .eq("user_id", params.id)
        .single()

      if (error) throw error

      const formattedTalent: TalentProfile = {
        id: talentData.user_id,
        full_name: talentData.profiles.full_name || "Anonymous",
        avatar_url: talentData.profiles.avatar_url || "",
        bio: talentData.bio || "",
        skills: talentData.skills || [],
        experience_level: talentData.experience_level || "junior",
        hourly_rate: talentData.hourly_rate || 0,
        location: talentData.location || "",
        country: talentData.country || "",
        pok_score: talentData.pok_score || 0,
        pos_score: talentData.pos_score || 0,
        reputation_score: talentData.reputation_score || 0,
        total_reviews: talentData.total_reviews || 0,
        availability: talentData.availability || "full-time",
        ens_address: talentData.ens_address || "",
      }

      setTalent(formattedTalent)
      setFormData((prev) => ({
        ...prev,
        ratePerHour: formattedTalent.hourly_rate,
        selectedSkills: formattedTalent.skills.slice(0, 3), // Pre-select top 3 skills
      }))
    } catch (error) {
      console.error("Error fetching talent:", error)
      router.push("/marketplace")
    } finally {
      setLoading(false)
    }
  }

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter((s) => s !== skill)
        : [...prev.selectedSkills, skill],
    }))
  }

  const handleSubmit = async () => {
    if (!talent || !user) return

    setSubmitting(true)
    try {
      // Get employer profile
      const { data: employer } = await supabase.from("employers").select("*").eq("user_id", user.id).single()

      if (!employer) {
        alert("Please complete your employer profile first")
        router.push("/employer-onboarding")
        return
      }

      // Create job posting
      const { data: job, error } = await supabase
        .from("jobs")
        .insert({
          employer_id: employer.id,
          talent_id: talent.id,
          title: formData.projectTitle,
          description: formData.projectDescription,
          skills_required: formData.selectedSkills,
          engagement_type: formData.engagementType,
          hours_per_week: formData.hoursPerWeek,
          rate: formData.ratePerHour,
          message: formData.message,
          status: "pending",
          company_name: employer.company_name,
        })
        .select()
        .single()

      if (error) throw error

      setSubmitted(true)
    } catch (error) {
      console.error("Error submitting hire request:", error)
      alert("Failed to submit hire request. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const isFormValid = () => {
    return (
      formData.projectTitle.trim() &&
      formData.projectDescription.trim() &&
      formData.engagementType &&
      formData.selectedSkills.length > 0 &&
      formData.ratePerHour > 0 &&
      formData.message.trim()
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading talent profile...</p>
        </div>
      </div>
    )
  }

  if (!talent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Talent Not Found</h2>
          <p className="text-gray-600 mb-6">The talent profile you're looking for doesn't exist.</p>
          <Link href="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center pt-16">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hire Request Sent!</h2>
            <p className="text-gray-600 mb-6">
              Your hire request has been sent to {talent.full_name}. They will receive a notification and can accept or
              decline your offer.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/employer-dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="outline">Back to Marketplace</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-16">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/marketplace">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Hire {talent.full_name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Talent Profile Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                    {talent.full_name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{talent.full_name}</CardTitle>
                    {talent.ens_address && <p className="text-sm text-blue-600 font-mono">{talent.ens_address}</p>}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <MapPin className="h-3 w-3" />
                      {talent.location || talent.country || "Remote"}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{talent.bio}</p>

                {/* Credentials */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col items-center">
                    <Trophy className="h-5 w-5 text-yellow-500 mb-1" />
                    <span className="text-sm font-medium">{talent.pok_score}</span>
                    <span className="text-xs text-gray-500">POK</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Award className="h-5 w-5 text-blue-500 mb-1" />
                    <span className="text-sm font-medium">{talent.pos_score}</span>
                    <span className="text-xs text-gray-500">POS</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Star className="h-5 w-5 text-orange-500 mb-1" />
                    <span className="text-sm font-medium">{talent.reputation_score.toFixed(1)}</span>
                    <span className="text-xs text-gray-500">Rating</span>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Skills</Label>
                  <div className="flex flex-wrap gap-1">
                    {talent.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Availability & Rate */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Availability:</span>
                    <Badge variant="outline" className="capitalize">
                      {talent.availability}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rate:</span>
                    <span className="text-sm font-medium">${talent.hourly_rate}/hour</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hire Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Hire Request Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Project Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Build React Dashboard for Analytics Platform"
                    value={formData.projectTitle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, projectTitle: e.target.value }))}
                  />
                </div>

                {/* Project Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the project, requirements, and deliverables..."
                    rows={4}
                    value={formData.projectDescription}
                    onChange={(e) => setFormData((prev) => ({ ...prev, projectDescription: e.target.value }))}
                  />
                </div>

                {/* Skills Selection */}
                <div className="space-y-3">
                  <Label>Required Skills * (select from talent's skills)</Label>
                  <div className="flex flex-wrap gap-2">
                    {talent.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant={formData.selectedSkills.includes(skill) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleSkillToggle(skill)}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">Selected: {formData.selectedSkills.length} skill(s)</p>
                </div>

                <Separator />

                {/* Engagement Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="engagement">Engagement Type *</Label>
                    <Select
                      value={formData.engagementType}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, engagementType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select engagement type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hours">Hours per Week *</Label>
                    <Select
                      value={formData.hoursPerWeek.toString()}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, hoursPerWeek: Number.parseInt(value) }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 hours/week</SelectItem>
                        <SelectItem value="20">20 hours/week</SelectItem>
                        <SelectItem value="30">30 hours/week</SelectItem>
                        <SelectItem value="40">40 hours/week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Rate */}
                <div className="space-y-2">
                  <Label htmlFor="rate">Rate per Hour * (USD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="rate"
                      type="number"
                      placeholder="0"
                      className="pl-10"
                      value={formData.ratePerHour}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, ratePerHour: Number.parseFloat(e.target.value) || 0 }))
                      }
                    />
                  </div>
                  <p className="text-xs text-gray-500">Talent's suggested rate: ${talent.hourly_rate}/hour</p>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message to Talent *</Label>
                  <Textarea
                    id="message"
                    placeholder="Introduce yourself, explain why you'd like to work with this talent, and any additional details..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={!isFormValid() || submitting}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {submitting ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Sending Request...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Hire Request
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
