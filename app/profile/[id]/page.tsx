"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Trophy, Award, MapPin, Clock, Github, Linkedin, Globe, Mail } from "lucide-react"
import Link from "next/link"

interface TalentProfile {
  id: string
  full_name: string
  email: string
  avatar_url: string
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

interface NFTToken {
  id: string
  token_type: "pok" | "pos"
  metadata: {
    title: string
    description: string
    category: string
    difficulty: string
  }
  minted_at: string
}

interface Review {
  id: string
  rating: number
  comment: string
  project_context: string
  created_at: string
  reviewer: {
    full_name: string
  }
}

export default function ProfilePage() {
  const params = useParams()
  const [talent, setTalent] = useState<TalentProfile | null>(null)
  const [nftTokens, setNftTokens] = useState<NFTToken[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    if (params.id) {
      fetchTalentProfile()
      fetchNFTTokens()
      fetchReviews()
    }
  }, [params.id])

  const fetchTalentProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("talents")
        .select(`
          *,
          profiles!inner(full_name, email, avatar_url)
        `)
        .eq("id", params.id)
        .single()

      if (error) throw error

      setTalent({
        id: data.id,
        full_name: data.profiles.full_name || "Anonymous",
        email: data.profiles.email,
        avatar_url: data.profiles.avatar_url || "",
        bio: data.bio || "",
        skills: data.skills || [],
        experience_level: data.experience_level || "junior",
        hourly_rate: data.hourly_rate || 0,
        location: data.location || "",
        availability: data.availability || "full-time",
        portfolio_url: data.portfolio_url || "",
        github_url: data.github_url || "",
        linkedin_url: data.linkedin_url || "",
        total_pok_score: data.total_pok_score || 0,
        total_pos_score: data.total_pos_score || 0,
        reputation_score: data.reputation_score || 0,
        total_reviews: data.total_reviews || 0,
      })
    } catch (error) {
      console.error("Error fetching talent profile:", error)
    }
  }

  const fetchNFTTokens = async () => {
    try {
      const { data, error } = await supabase
        .from("nft_tokens")
        .select("*")
        .eq("user_id", params.id)
        .order("minted_at", { ascending: false })

      if (error) throw error
      setNftTokens(data || [])
    } catch (error) {
      console.error("Error fetching NFT tokens:", error)
    }
  }

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          profiles!reviews_reviewer_id_fkey(full_name)
        `)
        .eq("talent_id", params.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      const formattedReviews =
        data?.map((review) => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          project_context: review.project_context,
          created_at: review.created_at,
          reviewer: {
            full_name: review.profiles?.full_name || "Anonymous",
          },
        })) || []

      setReviews(formattedReviews)
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!talent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Profile Not Found</h1>
          <p className="text-slate-600 mb-4">The talent profile you're looking for doesn't exist.</p>
          <Link href="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-4xl mx-auto md:mx-0">
                {talent.full_name.charAt(0)}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{talent.full_name}</h1>
                <div className="flex items-center justify-center md:justify-start gap-2 text-slate-600 mb-4">
                  <MapPin className="h-4 w-4" />
                  {talent.location || "Remote"}
                </div>

                <p className="text-slate-700 mb-4 max-w-2xl">{talent.bio}</p>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  {talent.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {talent.portfolio_url && (
                    <a href={talent.portfolio_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <Globe className="h-4 w-4 mr-2" />
                        Portfolio
                      </Button>
                    </a>
                  )}
                  {talent.github_url && (
                    <a href={talent.github_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </Button>
                    </a>
                  )}
                  {talent.linkedin_url && (
                    <a href={talent.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                    </a>
                  )}
                </div>
              </div>

              <div className="text-center">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{talent.total_pok_score}</div>
                    <div className="text-sm text-slate-600">POK Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{talent.total_pos_score}</div>
                    <div className="text-sm text-slate-600">POS Score</div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{talent.reputation_score.toFixed(1)}</span>
                  <span className="text-slate-600">({talent.total_reviews} reviews)</span>
                </div>

                <div className="text-lg font-bold text-slate-900 mb-2">${talent.hourly_rate}/hr</div>
                <Badge variant="outline">{talent.availability}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="credentials" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="credentials">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {nftTokens.map((token) => (
                <Card key={token.id}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      {token.token_type === "pok" ? (
                        <Trophy className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <Award className="h-5 w-5 text-blue-500" />
                      )}
                      <CardTitle className="text-lg">{token.metadata.title}</CardTitle>
                      <Badge variant={token.token_type === "pok" ? "default" : "secondary"}>
                        {token.token_type.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-2">{token.metadata.description}</p>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="outline">{token.metadata.category}</Badge>
                      <Badge variant="outline">{token.metadata.difficulty}</Badge>
                    </div>
                    <p className="text-sm text-slate-500">Minted {new Date(token.minted_at).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))}

              {nftTokens.length === 0 && (
                <div className="col-span-2 text-center py-8">
                  <Award className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No Credentials Yet</h3>
                  <p className="text-slate-600">This talent hasn't earned any POK or POS credentials yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-bold">
                        {review.reviewer.full_name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{review.reviewer.full_name}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "text-yellow-500 fill-current" : "text-slate-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-slate-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {review.project_context && (
                          <p className="text-sm text-slate-600 mb-2">
                            <strong>Project:</strong> {review.project_context}
                          </p>
                        )}
                        <p className="text-slate-700">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {reviews.length === 0 && (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No Reviews Yet</h3>
                  <p className="text-slate-600">This talent hasn't received any reviews yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-slate-500" />
                  <span>{talent.email}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-slate-500" />
                  <span>Available for {talent.availability} work</span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-slate-500" />
                  <span>{talent.location || "Remote"}</span>
                </div>

                <Button className="w-full mt-6">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
