"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Trophy, Award, MapPin, Clock, Filter } from "lucide-react"
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
  total_pok_score: number
  total_pos_score: number
  reputation_score: number
  total_reviews: number
  availability: string
}

export default function MarketplacePage() {
  const [talents, setTalents] = useState<TalentProfile[]>([])
  const [filteredTalents, setFilteredTalents] = useState<TalentProfile[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [skillFilter, setSkillFilter] = useState("")
  const [experienceFilter, setExperienceFilter] = useState("")
  const [sortBy, setSortBy] = useState("reputation")
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchTalents()
  }, [])

  useEffect(() => {
    filterAndSortTalents()
  }, [talents, searchQuery, skillFilter, experienceFilter, sortBy])

  const fetchTalents = async () => {
    try {
      const { data, error } = await supabase
        .from("talents")
        .select(`
          id,
          bio,
          skills,
          experience_level,
          hourly_rate,
          location,
          total_pok_score,
          total_pos_score,
          reputation_score,
          total_reviews,
          availability,
          profiles!inner(full_name, avatar_url)
        `)
        .order("reputation_score", { ascending: false })

      if (error) throw error

      const formattedTalents =
        data?.map((talent) => ({
          id: talent.id,
          full_name: talent.profiles.full_name || "Anonymous",
          avatar_url: talent.profiles.avatar_url || "",
          bio: talent.bio || "",
          skills: talent.skills || [],
          experience_level: talent.experience_level || "junior",
          hourly_rate: talent.hourly_rate || 0,
          location: talent.location || "",
          total_pok_score: talent.total_pok_score || 0,
          total_pos_score: talent.total_pos_score || 0,
          reputation_score: talent.reputation_score || 0,
          total_reviews: talent.total_reviews || 0,
          availability: talent.availability || "full-time",
        })) || []

      setTalents(formattedTalents)
    } catch (error) {
      console.error("Error fetching talents:", error)
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
      const matchesExperience = !experienceFilter || talent.experience_level === experienceFilter

      return matchesSearch && matchesSkill && matchesExperience
    })

    // Sort talents
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "reputation":
          return b.reputation_score - a.reputation_score
        case "pok_score":
          return b.total_pok_score - a.total_pok_score
        case "pos_score":
          return b.total_pos_score - a.total_pos_score
        case "hourly_rate":
          return a.hourly_rate - b.hourly_rate
        default:
          return 0
      }
    })

    setFilteredTalents(filtered)
  }

  const allSkills = Array.from(new Set(talents.flatMap((t) => t.skills)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading talent marketplace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 text-balance">Discover Verified Talent</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto text-pretty">
            Find skilled professionals with blockchain-verified credentials and proven expertise
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search talents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  {allSkills.map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="mid">Mid-level</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reputation">Reputation</SelectItem>
                  <SelectItem value="pok_score">POK Score</SelectItem>
                  <SelectItem value="pos_score">POS Score</SelectItem>
                  <SelectItem value="hourly_rate">Hourly Rate</SelectItem>
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
                    <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                      <MapPin className="h-3 w-3" />
                      {talent.location || "Remote"}
                    </div>
                    <Badge variant="outline" className="mt-2">
                      {talent.experience_level}
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
                    <span className="text-xs font-medium">{talent.total_pok_score}</span>
                    <span className="text-xs text-slate-500">POK</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Award className="h-4 w-4 text-blue-500 mb-1" />
                    <span className="text-xs font-medium">{talent.total_pos_score}</span>
                    <span className="text-xs text-slate-500">POS</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Star className="h-4 w-4 text-orange-500 mb-1" />
                    <span className="text-xs font-medium">{talent.reputation_score.toFixed(1)}</span>
                    <span className="text-xs text-slate-500">Rating</span>
                  </div>
                </div>

                {/* Rate and Availability */}
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">${talent.hourly_rate}/hr</span>
                  <div className="flex items-center gap-1 text-slate-600">
                    <Clock className="h-3 w-3" />
                    {talent.availability}
                  </div>
                </div>

                <Link href={`/profile/${talent.id}`}>
                  <Button className="w-full">View Profile</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTalents.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No talents found</h3>
            <p className="text-slate-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
