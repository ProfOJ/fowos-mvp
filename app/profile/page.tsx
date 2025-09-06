"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Trophy, Award, Edit, Save, X, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface UserProfile {
  id: string
  full_name: string
  email: string
  user_type: "talent" | "employer"
  avatar_url: string
}

interface TalentProfile {
  bio: string
  skills: string[]
  experience_level: string
  hourly_rate: number
  location: string
  availability: string
  portfolio_url: string
  github_url: string
  linkedin_url: string
  total_pok_score: number
  total_pos_score: number
  reputation_score: number
  total_reviews: number
}

export default function MyProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [talent, setTalent] = useState<TalentProfile | null>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        router.push("/auth/login")
        return
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single()

      if (profileError) throw profileError

      setUser(profile)

      // If user is talent, fetch talent profile
      if (profile.user_type === "talent") {
        const { data: talentData, error: talentError } = await supabase
          .from("talents")
          .select("*")
          .eq("id", authUser.id)
          .single()

        if (talentError && talentError.code !== "PGRST116") {
          throw talentError
        }

        setTalent(
          talentData || {
            bio: "",
            skills: [],
            experience_level: "junior",
            hourly_rate: 0,
            location: "",
            availability: "full-time",
            portfolio_url: "",
            github_url: "",
            linkedin_url: "",
            total_pok_score: 0,
            total_pos_score: 0,
            reputation_score: 0,
            total_reviews: 0,
          },
        )
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user || !talent) return

    setSaving(true)
    try {
      const { error } = await supabase.from("talents").upsert({
        id: user.id,
        ...talent,
      })

      if (error) throw error

      setEditing(false)
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setSaving(false)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && talent && !talent.skills.includes(newSkill.trim())) {
      setTalent({
        ...talent,
        skills: [...talent.skills, newSkill.trim()],
      })
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    if (talent) {
      setTalent({
        ...talent,
        skills: talent.skills.filter((skill) => skill !== skillToRemove),
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (user.user_type === "employer") {
    router.push("/employer-dashboard")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          {!editing ? (
            <Button onClick={() => setEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={() => setEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900">{talent?.total_pok_score || 0}</div>
              <div className="text-slate-600">POK Score</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900">{talent?.total_pos_score || 0}</div>
              <div className="text-slate-600">POS Score</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900">{talent?.reputation_score?.toFixed(1) || "0.0"}</div>
              <div className="text-slate-600">Reputation ({talent?.total_reviews || 0} reviews)</div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="skills">Skills & Experience</TabsTrigger>
                <TabsTrigger value="links">Links & Contact</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={user.full_name || ""} disabled className="bg-slate-50" />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} disabled className="bg-slate-50" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={talent?.bio || ""}
                    onChange={(e) => talent && setTalent({ ...talent, bio: e.target.value })}
                    disabled={!editing}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., San Francisco, CA"
                      value={talent?.location || ""}
                      onChange={(e) => talent && setTalent({ ...talent, location: e.target.value })}
                      disabled={!editing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                    <Input
                      id="hourly_rate"
                      type="number"
                      placeholder="50"
                      value={talent?.hourly_rate || ""}
                      onChange={(e) =>
                        talent && setTalent({ ...talent, hourly_rate: Number.parseFloat(e.target.value) || 0 })
                      }
                      disabled={!editing}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="skills" className="space-y-4">
                <div>
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select
                    value={talent?.experience_level || "junior"}
                    onValueChange={(value) => talent && setTalent({ ...talent, experience_level: value })}
                    disabled={!editing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="mid">Mid-level</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Select
                    value={talent?.availability || "full-time"}
                    onValueChange={(value) => talent && setTalent({ ...talent, availability: value })}
                    disabled={!editing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Skills</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {talent?.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        {editing && <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />}
                      </Badge>
                    ))}
                  </div>

                  {editing && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addSkill()}
                      />
                      <Button onClick={addSkill} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="links" className="space-y-4">
                <div>
                  <Label htmlFor="portfolio">Portfolio URL</Label>
                  <Input
                    id="portfolio"
                    placeholder="https://yourportfolio.com"
                    value={talent?.portfolio_url || ""}
                    onChange={(e) => talent && setTalent({ ...talent, portfolio_url: e.target.value })}
                    disabled={!editing}
                  />
                </div>

                <div>
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input
                    id="github"
                    placeholder="https://github.com/yourusername"
                    value={talent?.github_url || ""}
                    onChange={(e) => talent && setTalent({ ...talent, github_url: e.target.value })}
                    disabled={!editing}
                  />
                </div>

                <div>
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/in/yourusername"
                    value={talent?.linkedin_url || ""}
                    onChange={(e) => talent && setTalent({ ...talent, linkedin_url: e.target.value })}
                    disabled={!editing}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
