import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { projectId, skills, walletAddress } = await request.json()

    if (!projectId || !skills || !walletAddress) {
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
        token_type: "POS",
        project_id: projectId,
        wallet_address: walletAddress,
        token_id: `pos_${Date.now()}`, // Temporary token ID
        metadata: {
          skills,
          project_id: projectId,
          minted_at: new Date().toISOString(),
        },
      })
      .select()
      .single()

    if (tokenError) {
      console.error("Error creating POS token:", tokenError)
      return NextResponse.json({ error: "Failed to mint POS token" }, { status: 500 })
    }

    // Update talent POS score
    await supabase
      .from("talents")
      .update({
        pos_score: supabase.raw("pos_score + ?", [skills.length * 10]),
      })
      .eq("user_id", user.id)

    return NextResponse.json({
      success: true,
      tokenId: token.token_id,
      message: "POS token minted successfully",
    })
  } catch (error) {
    console.error("Error in POS minting:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
