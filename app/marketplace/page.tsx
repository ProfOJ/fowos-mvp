"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Trophy, Award, MapPin, Filter, Eye, Briefcase } from "lucide-react"
import Link from "next/link"
import { SKILL_CATEGORIES } from "@/lib/categories"

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
  created_at: string
  category: string
}

export default function MarketplacePage() {
  const [talents, setTalents] = useState<TalentProfile[]>([])
  const [filteredTalents, setFilteredTalents] = useState<TalentProfile[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [skillFilter, setSkillFilter] = useState("")
  const [countryFilter, setCountryFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [sortBy, setSortBy] = useState("pok_pos_combined")
  const [dateRange, setDateRange] = useState("all")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    checkUser()
    fetchTalents()
  }, [])

  useEffect(() => {
    filterAndSortTalents()
  }, [talents, searchQuery, skillFilter, countryFilter, categoryFilter, sortBy, dateRange])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)
  }

  const fetchTalents = async () => {
    try {
      const { data: talentData, error: talentError } = await supabase.from("talents").select(`
          id,
          user_id,
          bio,
          skills,
          experience_level,
          hourly_rate,
          location,
          country,
          pok_score,
          pos_score,
          reputation_score,
          total_reviews,
          availability,
          ens_address,
          created_at,
          profiles!inner(full_name, avatar_url)
        `)

      const { data: employerData, error: employerError } = await supabase.from("employers").select(`
          id,
          user_id,
          company_description,
          company_size,
          industry,
          location,
          country,
          created_at,
          profiles!inner(full_name, avatar_url)
        `)

      if (talentError) throw talentError
      if (employerError) throw employerError

      const formattedTalents =
        talentData?.map((talent) => ({
          id: talent.user_id,
          full_name: talent.profiles.full_name || "Anonymous",
          avatar_url: talent.profiles.avatar_url || "",
          bio: talent.bio || "",
          skills: talent.skills || [],
          experience_level: talent.experience_level || "junior",
          hourly_rate: talent.hourly_rate || 0,
          location: talent.location || "",
          country: talent.country || "",
          pok_score: talent.pok_score || 0,
          pos_score: talent.pos_score || 0,
          reputation_score: talent.reputation_score || 0,
          total_reviews: talent.total_reviews || 0,
          availability: talent.availability || "full-time",
          ens_address: talent.ens_address || "",
          created_at: talent.created_at,
          category: talent.skills?.[0] || "General",
        })) || []

      const formattedEmployers =
        employerData?.map((employer) => ({
          id: employer.user_id,
          full_name: employer.profiles.full_name || "Anonymous Company",
          avatar_url: employer.profiles.avatar_url || "",
          bio: employer.company_description || "",
          skills: [employer.industry || "Business"],
          experience_level: "company",
          hourly_rate: 0,
          location: employer.location || "",
          country: employer.country || "",
          pok_score: 0,
          pos_score: 0,
          reputation_score: 0,
          total_reviews: 0,
          availability: "hiring",
          ens_address: "",
          created_at: employer.created_at,
          category: employer.industry || "Business",
        })) || []

      const allUsers = [...formattedTalents, ...formattedEmployers]
      setTalents(allUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortTalents = () => {
    const filtered = talents.filter((talent) => {
      const matchesSearch =
        talent.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        talent.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        talent.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesSkill = !skillFilter || talent.skills.includes(skillFilter)
      const matchesCountry = !countryFilter || talent.country === countryFilter
      const matchesCategory = !categoryFilter || talent.category === categoryFilter

      // Date range filter
      let matchesDate = true
      if (dateRange !== "all") {
        const createdDate = new Date(talent.created_at)
        const now = new Date()
        const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))

        switch (dateRange) {
          case "week":
            matchesDate = daysDiff <= 7
            break
          case "month":
            matchesDate = daysDiff <= 30
            break
          case "year":
            matchesDate = daysDiff <= 365
            break
        }
      }

      return matchesSearch && matchesSkill && matchesCountry && matchesCategory && matchesDate
    })

    // Sort users
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "pok_score":
          return b.pok_score - a.pok_score
        case "pos_score":
          return b.pos_score - a.pos_score
        case "pok_pos_combined":
          return b.pok_score + b.pos_score - (a.pok_score + a.pos_score)
        case "reputation":
          return b.reputation_score - a.reputation_score
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

    setFilteredTalents(filtered)
  }

  const allSkills = Array.from(new Set(talents.flatMap((t) => t.skills)))
  const allCountries = Array.from(new Set(talents.map((t) => t.country).filter(Boolean)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading marketplace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 text-balance">FOWOS Marketplace</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto text-pretty">
            Discover verified talent and companies with blockchain credentials
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pok_pos_combined">POK + POS Score</SelectItem>
                  <SelectItem value="pok_score">POK Score</SelectItem>
                  <SelectItem value="pos_score">POS Score</SelectItem>
                  <SelectItem value="reputation">Reputation</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">All Categories</SelectItem>
                  {SKILL_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Countries</SelectItem>
                  {allCountries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>

              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Skills</SelectItem>
                  {allSkills.map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTalents.map((talent) => (
            <Card key={talent.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                    {talent.full_name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{talent.full_name}</CardTitle>
                    {talent.ens_address && <p className="text-sm text-blue-600 font-mono">{talent.ens_address}</p>}
                    <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                      <MapPin className="h-3 w-3" />
                      {talent.location || talent.country || "Remote"}
                    </div>
                    <Badge variant="outline" className="mt-2">
                      {talent.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 line-clamp-2">{talent.bio || "No bio available"}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1">
                  {talent.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {talent.skills.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{talent.skills.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Credentials */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col items-center">
                    <Trophy className="h-4 w-4 text-yellow-500 mb-1" />
                    <span className="text-xs font-medium">{talent.pok_score}</span>
                    <span className="text-xs text-slate-500">POK</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Award className="h-4 w-4 text-blue-500 mb-1" />
                    <span className="text-xs font-medium">{talent.pos_score}</span>
                    <span className="text-xs text-slate-500">POS</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Star className="h-4 w-4 text-orange-500 mb-1" />
                    <span className="text-xs font-medium">{talent.reputation_score.toFixed(1)}</span>
                    <span className="text-xs text-slate-500">Rating</span>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-xs text-slate-500 text-center">
                  Joined {new Date(talent.created_at).toLocaleDateString()}
                </div>

                <div className="flex gap-2">
                  <Link href={`/profile/${talent.id}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  {user && talent.experience_level !== "company" && (
                    <Link href={`/hire/${talent.id}`} className="flex-1">
                      <Button className="w-full">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Hire
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTalents.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No users found</h3>
            <p className="text-slate-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
