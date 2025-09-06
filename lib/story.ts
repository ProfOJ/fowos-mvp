// Story Protocol integration for POK records
import { createClient } from "@/lib/supabase/client"

export interface POKRecord {
  userId: string
  quizId: string
  score: number
  timestamp: number
}

export class StoryProtocolManager {
  private static instance: StoryProtocolManager
  private supabase = createClient()

  static getInstance(): StoryProtocolManager {
    if (!StoryProtocolManager.instance) {
      StoryProtocolManager.instance = new StoryProtocolManager()
    }
    return StoryProtocolManager.instance
  }

  async writePOK(userId: string, quizId: string, score: number): Promise<string> {
    try {
      // Get user's wallet address
      const { data: wallet } = await this.supabase
        .from("user_wallets")
        .select("wallet_address")
        .eq("user_id", userId)
        .single()

      if (!wallet) {
        throw new Error("User wallet not found")
      }

      // Create POK record on Story Protocol (simulated for now)
      const pokData: POKRecord = {
        userId,
        quizId,
        score,
        timestamp: Date.now(),
      }

      // Simulate blockchain transaction
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`

      // Save to Supabase after successful blockchain write
      const { error } = await this.supabase.from("pok_records").insert({
        user_id: userId,
        quiz_id: quizId,
        score,
        tx_hash: txHash,
      })

      if (error) throw error

      return txHash
    } catch (error) {
      console.error("Error writing POK:", error)
      throw error
    }
  }

  async fetchPOKsByUser(userId: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from("pok_records")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching POKs:", error)
      return []
    }
  }

  async fetchLeaderboard(limit = 10): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from("pok_records")
        .select(`
          *,
          profiles!inner(
            id,
            wallet_address,
            ens_name
          )
        `)
        .order("score", { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
      return []
    }
  }

  async fetchProfilePOKs(userId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from("pok_records")
        .select("*")
        .eq("user_id", userId)
        .order("score", { ascending: false })

      if (error) throw error

      // Group by quiz_id and get best score for each
      const poksByQuiz = (data || []).reduce((acc: any, pok: any) => {
        if (!acc[pok.quiz_id] || acc[pok.quiz_id].score < pok.score) {
          acc[pok.quiz_id] = pok
        }
        return acc
      }, {})

      return {
        totalAttempts: data?.length || 0,
        bestScores: Object.values(poksByQuiz),
        averageScore: data?.length
          ? Math.round(data.reduce((sum: number, pok: any) => sum + pok.score, 0) / data.length)
          : 0,
      }
    } catch (error) {
      console.error("Error fetching profile POKs:", error)
      return { totalAttempts: 0, bestScores: [], averageScore: 0 }
    }
  }
}
