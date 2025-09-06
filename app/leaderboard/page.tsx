"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Trophy, Medal, Award, Eye, Search } from "lucide-react"
import { SKILL_CATEGORIES, COUNTRIES } from "@/lib/categories"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface LeaderboardEntry {
  id: string
  full_name: string
  avatar_url?: string
  ens_address?: string
  country?: string
  pok_score: number
  pos_score: number
  total_score: number
  category: string
  last_activity: string
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: "total", // pok, pos, total
    category: "all",
    country: "all",
    dateRange: "all",
  })
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchLeaderboardData()
  }, [filters])

  const fetchLeaderboardData = async () => {
    setLoading(true)
    try {
      const supabase = createClient()

      let query = supabase.from("talents").select(`
          user_id,
          pok_score,
          pos_score,
          primary_skills,
          profiles!inner(
            full_name,
            avatar_url,
            country
          )
        `)

      // Apply filters
      if (filters.country !== "all") {
        query = query.eq("profiles.country", filters.country)
      }

      const { data, error } = await query.order(
        filters.type === "pok" ? "pok_score" : filters.type === "pos" ? "pos_score" : "pok_score",
        { ascending: false },
      )

      if (error) throw error

      const formattedEntries: LeaderboardEntry[] =
        data?.map((item, index) => ({
          id: item.user_id,
          full_name: item.profiles.full_name || "Anonymous",
          avatar_url: item.profiles.avatar_url,
          ens_address: `talent${index + 1}.eth`,
          country: item.profiles.country,
          pok_score: item.pok_score || 0,
          pos_score: item.pos_score || 0,
          total_score: (item.pok_score || 0) + (item.pos_score || 0),
          category: item.primary_skills?.[0] || "General",
          last_activity: new Date().toISOString(),
        })) || []

      // Sort by selected type
      formattedEntries.sort((a, b) => {
        if (filters.type === "pok") return b.pok_score - a.pok_score
        if (filters.type === "pos") return b.pos_score - a.pos_score
        return b.total_score - a.total_score
      })

      setEntries(formattedEntries)
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEntries = entries.filter(
    (entry) =>
      entry.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />
    return <span className="text-sm font-medium text-gray-500">#{rank}</span>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="h-8 w-8 text-yellow-600" />
            <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover top talent ranked by their verified POK and POS credentials
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Score Type</label>
                <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="total">Total Score</SelectItem>
                    <SelectItem value="pok">POK Score</SelectItem>
                    <SelectItem value="pos">POS Score</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {SKILL_CATEGORIES.slice(0, 20).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Country</label>
                <Select value={filters.country} onValueChange={(value) => setFilters({ ...filters, country: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {COUNTRIES.slice(0, 20).map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Date Range</label>
                <Select
                  value={filters.dateRange}
                  onValueChange={(value) => setFilters({ ...filters, dateRange: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search talent..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Top Talent</span>
              <Badge variant="secondary">{filteredEntries.length} talents</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                filteredEntries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8">{getRankIcon(index + 1)}</div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={entry.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback>{entry.full_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">{entry.full_name}</div>
                        <div className="text-sm text-gray-600">{entry.ens_address}</div>
                      </div>
                      <Badge variant="outline">{entry.category}</Badge>
                      {entry.country && <Badge variant="secondary">{entry.country}</Badge>}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {filters.type === "pok"
                            ? entry.pok_score
                            : filters.type === "pos"
                              ? entry.pos_score
                              : entry.total_score}{" "}
                          pts
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(entry.last_activity).toLocaleDateString()}
                        </div>
                      </div>
                      <Link href={`/profile/${entry.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
