import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { quizId, score, walletAddress } = await request.json()

    if (!quizId || !score || !walletAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create NFT token record
    const { data: token, error: tokenError } = await supabase
      .from("nft_tokens")
      .insert({
        user_id: user.id,
        token_type: "POK",
        quiz_id: quizId,
        wallet_address: walletAddress,
        token_id: `pok_${Date.now()}`, // Temporary token ID
        metadata: {
          score,
          quiz_id: quizId,
          minted_at: new Date().toISOString(),
        },
      })
      .select()
      .single()

    if (tokenError) {
      console.error("Error creating POK token:", tokenError)
      return NextResponse.json({ error: "Failed to mint POK token" }, { status: 500 })
    }

    // Update talent POK score
    await supabase
      .from("talents")
      .update({
        pok_score: supabase.raw("pok_score + ?", [Math.floor(score / 10)]),
      })
      .eq("user_id", user.id)

    return NextResponse.json({
      success: true,
      tokenId: token.token_id,
      message: "POK token minted successfully",
    })
  } catch (error) {
    console.error("Error in POK minting:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
